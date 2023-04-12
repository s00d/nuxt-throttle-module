# Nuxt Throttle Module

[![npm version](https://badge.fury.io/js/nuxt-throttle-module.svg)](https://badge.fury.io/js/nuxt-throttle-module)
[![npm downloads](https://img.shields.io/npm/dw/nuxt-throttle-module)](https://badge.fury.io/js/nuxt-throttle-module)
[![NPM license](https://img.shields.io/npm/l/nuxt-throttle-module)](https://github.com/s00d/nuxt-throttle-module/blob/master/LICENSE)
[![npm type definitions](https://img.shields.io/npm/types/nuxt-throttle-module)](https://github.com/s00d/nuxt-throttle-module)
[![donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.me/s00d)
[![GitHub Repo stars](https://img.shields.io/github/stars/s00d/nuxt-throttle-module?style=social)](https://github.com/s00d/nuxt-throttle-module)


This module is designed to limit the number of requests made to the server from a single IP address and and the total number of participants for nuxt 2 and nuxt 3. It defines a Nuxt module that can be used in a Nuxt application.

The module requires Redis to work. See ENV for more information.

## Quick Setup

1. Add `nuxt-throttle-module` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-throttle-module

# Using yarn
yarn add --dev nuxt-throttle-module

# Using npm
npm install --save-dev nuxt-throttle-module
```

2. Add `nuxt-throttle-module` to the `modules` section of `nuxt.config.ts`

nuxt 3
```js
export default defineNuxtConfig({
  modules: [
    'nuxt-throttle-module'
  ],
  throttleModule: {
    ipMaxCount: 200,
    minuteMaxCount: 2000,
    secondMaxCount: 20,
  }
})
```

nuxt 2
```js
export default {
  modules: [
    'nuxt-throttle-module'
  ],
  throttleModule: {
    ipMaxCount: 200,
    minuteMaxCount: 2000,
    secondMaxCount: 20,
  }
}
```

That's it! You can now use My Module in your Nuxt app ✨

## Options
The module accepts configuration options in the form of a TypeScript interface ModuleOptions. These options include:

- `ipMaxCount` - the maximum number of requests that can be made from a single IP address
- `minuteMaxCount` - the maximum number of requests that can be made in a minute
- `secondMaxCount` - the maximum number of requests that can be made in a second
- `prefix` - redis prefix
These options can be overridden when initializing the module.

## ENV

- process.env.REDIS_HOST - redis host
- process.env.REDIS_PORT - redis port
