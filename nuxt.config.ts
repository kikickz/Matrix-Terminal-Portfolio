// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt',
    '@nuxtjs/robots'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Kieran Boudouin | Software Developer ',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'Kieran Boudouin - Software Developer' },
        { name: 'author', content: 'Kieran Boudouin' },
        { property: 'og:title', content: 'Kieran Boudouin' },
        { property: 'og:description', content: 'Kieran Boudouin - Software Developer' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Kieran Boudouin' },
        { name: 'twitter:description', content: 'Kieran Boudouin - Software Developer' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://kieranboudouin.com' }
      ]
    }
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://kieranboudouin.com/sitemap.xml'
  }
})