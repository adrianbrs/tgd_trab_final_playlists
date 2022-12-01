<script setup>
import { useDisplay } from "vuetify";
const config = useRuntimeConfig();

const drawer = ref(true);
const rail = ref(true);
const { mobile } = useDisplay();

function toggleMenu() {
  if (mobile.value) {
    drawer.value = !drawer.value;
  } else {
    rail.value = !rail.value;
  }
}

const theme = useLocalStorage(
  "theme",
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
);

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}
</script>

<template>
  <v-app id="playlists" :theme="theme">
    <v-navigation-drawer
      :rail="rail && !mobile"
      v-model="drawer"
      class="pt-4"
      color="blue"
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="Usuários"
          to="/users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-multimedia"
          title="Mídias"
          to="/medias"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-playlist-play"
          title="Playlists"
          to="/playlists"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="text-center">
      <v-app-bar-nav-icon @click="toggleMenu()"></v-app-bar-nav-icon>

      <v-app-bar-title>Playlists - Trabalho Final - TGD 2022/2</v-app-bar-title>

      <v-btn @click="toggleTheme" icon>
        <v-icon
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        ></v-icon>
      </v-btn>

      <v-btn
        icon
        :href="config.repo.url"
        title="Ver código fonte"
        target="_blank"
      >
        <v-icon icon="mdi-github"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container><router-view></router-view></v-container>
    </v-main>

    <v-footer class="d-flex" app>
      <div class="px-4 py-2 text-center text-truncate w-100">
        <small><strong>Adrian Cerbaro</strong> - UPF 2022/2</small>
      </div>

      <v-btn
        size="small"
        icon
        flat
        href="https://github.com/adrianbrs"
        target="_blank"
      >
        <v-icon icon="mdi-github"></v-icon>
      </v-btn>
      <v-btn
        size="small"
        icon
        flat
        href="https://linkedin.com/in/adrian-cerbaro"
        target="_blank"
      >
        <v-icon icon="mdi-linkedin"></v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>
