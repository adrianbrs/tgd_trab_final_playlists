<script setup>
</script>

<template>
  <v-app id="playlists">
    <v-navigation-drawer model-value class="pt-4" color="blue" expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="Usuários" to="/users"></v-list-item>
        <v-list-item prepend-icon="mdi-multimedia" title="Mídias" to="/medias"></v-list-item>
        <v-list-item prepend-icon="mdi-playlist-play" title="Playlists" to="/playlists"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
