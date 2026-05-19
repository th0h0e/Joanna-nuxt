// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/hints", "@nuxt/image", "@nuxt/scripts", "@compodium/nuxt"],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },

  routeRules: {
    "/api/**": { cors: true },
  },

  runtimeConfig: {
    // Server-side only (not exposed to client)
    pocketbaseUrl: "https://admin.kontext.site", // default value, overridden by NITRO_POCKETBASE_URL
    public: {
      pocketbaseUrl: "https://admin.kontext.site", // available on client
    },
  },

  ui: {
    theme: {
      defaultVariants: {
        size: 'sm'
      }
    }
  },
  devServer: {
    port: 3002
  },

  compatibilityDate: "2026-03-27",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
