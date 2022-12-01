<script setup>
const {
  data: users = [],
  pending: pendingUsers,
  refresh: refreshUsers,
} = useLazyFetch("/api/users");

const {
  data: medias = [],
  pending: pendingMedias,
  refresh: refreshMedias,
} = useLazyFetch("/api/medias");

const {
  data: playlists = [],
  pending: pendingPlaylists,
  refresh: refreshPlaylists,
} = useLazyFetch("/api/playlists");
</script>

<template>
  <h1>Dashboard</h1>

  <v-row>
    <v-col class="w-100" cols="12" md="4">
      <v-card title="Usuários" :loading="pendingUsers">
        <template v-slot:prepend>
          <v-btn flat icon="mdi-refresh" @click="refreshUsers()"></v-btn>
        </template>
        <template v-slot:append>
          <v-btn flat icon="mdi-chevron-right" to="/users"></v-btn>
        </template>

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" cols="6">{{ users?.length }}</v-col>

            <v-col cols="6" class="text-right mb-2">
              <v-icon
                color="blue"
                icon="mdi-account-multiple"
                size="64"
              ></v-icon>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card title="Mídias" :loading="pendingMedias">
        <template v-slot:prepend>
          <v-btn flat icon="mdi-refresh" @click="refreshMedias()"></v-btn>
        </template>
        <template v-slot:append>
          <v-btn flat icon="mdi-chevron-right" to="/medias"></v-btn>
        </template>

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" cols="6">{{ medias?.length }}</v-col>

            <v-col cols="6" class="text-right mb-2">
              <v-icon color="blue" icon="mdi-multimedia" size="64"></v-icon>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card title="Playlists" :loading="pendingPlaylists">
        <template v-slot:prepend>
          <v-btn flat icon="mdi-refresh" @click="refreshPlaylists()"></v-btn>
        </template>
        <template v-slot:append>
          <v-btn flat icon="mdi-chevron-right" to="/playlists"></v-btn>
        </template>

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" cols="6">{{ playlists?.length }}</v-col>

            <v-col cols="6" class="text-right mb-2">
              <v-icon color="blue" icon="mdi-playlist-play" size="64"></v-icon>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
