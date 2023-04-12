import {defineNuxtPlugin, showError, useRequestEvent, useRequestHeaders} from '#app'
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
});

export default defineNuxtPlugin(async (nuxtApp) => {
  const ipMaxCount= <%= options.ipMaxCount %>;
  const minuteMaxCount = <%= options.minuteMaxCount %>;
  const secondMaxCount = <%= options.secondMaxCount %>;
  const time = <%= options.time %>;
  const prefix = `<%= options.prefix %>`;

  const headers = useRequestHeaders()
  const event = useRequestEvent()
  let limit = 0;

  const ip = headers['x-forwarded-for'] ?? headers['x-real-ip'] ?? null;
  let ipCount = 999;

  if(ipMaxCount && ip) {
    ipCount = await redisClient.incr(`${prefix}:${ip}`);
    if (ipCount === 1) {
      redisClient.expire(`${prefix}:${ip}`, time);
    }

    limit = ipMaxCount - ipCount;
    if (ipCount > ipMaxCount) {
      event.node.res.setHeader('Retry-After', time.toString())
      showError({
        statusCode: 429,
        message: 'Too many requests from this IP, please try again later',
      })
      return;
    }
  }

  if(minuteMaxCount) {
    const minuteCount = await redisClient.incr(`${prefix}:minute`);
    if (minuteCount === 1) {
      redisClient.expire(`${prefix}:minute`, time);
    }
    if(minuteMaxCount - minuteCount < limit) limit = minuteMaxCount - minuteCount;
    if (minuteCount > minuteMaxCount) {
      event.node.res.setHeader('Retry-After', time.toString())
      showError({
        statusCode: 429,
        message: 'Too many requests, please try again later',
      })
      return;
    }
  }

  if(secondMaxCount) {
    const secondCount = await redisClient.incr(`${prefix}:second`);
    if (secondCount === 1) {
      redisClient.expire(`${prefix}:second`, 1);
    }
    if (secondCount > secondMaxCount) {
      event.node.res.setHeader('Retry-After', '1')
      showError({
        statusCode: 429,
        message: 'Too many requests, please try again later',
      })
      return;
    }
  }


  const now = Date.now();
  if(ipMaxCount) event.node.res.setHeader('X-RateLimit-Limit', ipMaxCount.toString());
  const offetIpcountdate = now + time * 1000;
  event.node.res.setHeader('X-RateLimit-Remaining', limit.toString());
  event.node.res.setHeader('X-RateLimit-Reset', offetIpcountdate.toString());

  return;
})
