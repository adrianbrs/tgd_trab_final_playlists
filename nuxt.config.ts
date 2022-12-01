import { repository } from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: "Playlists | Trabalho final - Tecnologias para Gestão de Dados",
      meta: [{ name: "format-detection", content: "telephone=no" }],
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI,
    public: {
      repo: {
        url: repository.url,
      },
    },
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
});
