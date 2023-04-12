import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
});

const ThrottlePlugin = async (context) => {
  const ipMaxCount = <%= options.ipMaxCount %>;
  const minuteMaxCount = <%= options.minuteMaxCount %>;
  const secondMaxCount = <%= options.secondMaxCount %>;
  const time = <%= options.time %>;
  const prefix = `<%= options.prefix %>`;

  let limit = 0;

  const headers = context.req.headers ?? {};

  const ip = headers['x-forwarded-for'] ?? headers['x-real-ip'] ?? null;
  let ipCount = 999;

  if(ipMaxCount && ip) {
    ipCount = await redisClient.incr(`${prefix}:${ip}`);
    if (ipCount === 1) {
      redisClient.expire(`${prefix}:${ip}`, time);
    }

    limit = ipMaxCount - ipCount;
    if (ipCount > ipMaxCount) {
      context.res.setHeader('Retry-After', time.toString())
      context.error({
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
      context.res.setHeader('Retry-After', time.toString())
      context.error({
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
      context.res.setHeader('Retry-After', '1')
      context.error({
        statusCode: 429,
        message: 'Too many requests, please try again later',
      })
      return;
    }
  }


  const now = Date.now();
  if(ipMaxCount) context.res.setHeader('X-RateLimit-Limit', ipMaxCount.toString());
  const offetIpcountdate = now + time * 1000;
  context.res.setHeader('X-RateLimit-Remaining', limit.toString());
  context.res.setHeader('X-RateLimit-Reset', offetIpcountdate.toString());

  return;
}

export default ThrottlePlugin;
