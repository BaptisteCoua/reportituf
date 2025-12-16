import { defineNuxtModule, addImportsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'datatable',
    configKey: 'datatable'
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addImportsDir(resolve('./composables'))
  }
})
