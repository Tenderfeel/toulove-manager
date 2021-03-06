import p from './package.json'

const SITE_NAME = '本丸管理'

export default {
  mode: 'universal',

  globalName: 'tkrmng',

  env: {
    VERSION: p.version,
    BASE_URL: process.env.BASE_URL,
    SITE_NAME
  },

  /*
   ** Headers of the page
   */
  head: {
    title: SITE_NAME,
    meta: [{ name: 'msapplication-TileColor', content: '#ffffff' }]
  },

  meta: {
    lang: 'ja',
    name: SITE_NAME,
    description: p.description,
    author: p.author,
    ogHost: process.env.BASE_URL,
    twitterCard: 'summary',
    twitterCreator: '@Tenderfeel'
  },

  manifest: {
    name: SITE_NAME,
    short_name: SITE_NAME,
    lang: 'ja',
    start_url: '.',
    display: 'standalone',
    orientation: 'landscape-primary',
    background_color: '#ffffff',
    theme_color: '#ffffff'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ffa0f3' },
  /*
   ** Global CSS
   */
  css: [
    // { src: 'ant-design-vue/dist/antd.less', lang: 'less' },
    { src: '@/assets/css/common.less', lang: 'less' }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/antd-ui', { src: '~/plugins/data', mode: 'client' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',

    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-2882410-18'
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    ['vue-wait/nuxt', { useVuex: true }]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** webpack config
     */
    extend(config, { loaders: { less } }) {
      less.lessOptions = {
        javascriptEnabled: true,
        modifyVars: {
          'font-family': `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
          'page-header-padding': 0
        }
      }
    },
    babel: {
      plugins: [
        // Must exclude "style: true"
        ['import', { libraryName: 'ant-design-vue' }, 'ant-design-vue']
      ]
    }
  }
}
