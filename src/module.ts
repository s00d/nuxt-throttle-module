import {defineNuxtModule, createResolver, addPluginTemplate, isNuxt3, isNuxt2} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  ipMaxCount?: number|null,
  minuteMaxCount?: number|null,
  secondMaxCount?: number|null,
  time?: number,
  prefix?: string,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-throttle-module',
    configKey: 'throttleModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    ipMaxCount: 100,
    minuteMaxCount: 1000,
    secondMaxCount: 10,
    time: 60,
    prefix: 'nuxt-throttle-module',
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if(isNuxt3(nuxt)) {
      addPluginTemplate({
        src: resolve('./runtime/plugin.js'),
        write: true,
        mode: "server",
        options
      })
    }
    if(isNuxt2(nuxt)) {
      addPluginTemplate({
        src: resolve('./runtime/plugin2.js'),
        write: true,
        mode: "server",
        options
      })
    }
  }
})
