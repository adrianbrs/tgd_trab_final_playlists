<script setup lang="ts">
import { Ref } from "vue";
import _merge from "lodash-es/merge";
const { data: playlists, pending, refresh } = useLazyFetch("/api/playlists");
const { data: users, pending: pendingUsers } = useLazyFetch("/api/users");

const emptyPlaylist = {
  _id: null as string | null,
  title: "",
  description: "",
  thumbnail: "",
  owner: {
    name: "",
  } as any,
  items: [] as any[],
};

const form: Ref<any> = ref(null);
const editDialog = ref(false);
const loading = ref(false);
const editData = reactive(_merge({}, emptyPlaylist));
const snackbar = reactive({
  active: false,
  text: null as string | null,
  color: "",
});
const viewDialog = ref(false);
const viewItem = ref(null as any);

async function remove(id: string) {
  await useFetch(`/api/playlists/${id}`, {
    method: "DELETE",
  });
  await refresh();
}

async function edit(playlist: any) {
  closeEdit();
  _merge(editData, playlist);
  editDialog.value = true;
}

async function save() {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      loading.value = true;

      if (editData._id) {
        const { _id, owner, ...data } = editData;
        await $fetch(`/api/playlists/${_id}`, {
          method: "PATCH",
          body: {
            ...data,
            owner: owner._id,
          },
        });
        notify("Alterações salvas", "green");
        refresh();
      } else {
        await $fetch(`/api/playlists`, {
          method: "POST",
          body: {
            ...editData,
            owner: editData.owner._id,
          },
        });
        notify("Playlist cadastrada", "green");
        refresh();
      }
    } catch (err) {
      console.error(err);
      notify("Erro ao salvar alterações", "red");
    } finally {
      loading.value = false;
    }

    closeEdit();
  }
}

function closeEdit() {
  form.value?.reset();
  editDialog.value = false;
  _merge(editData, emptyPlaylist);
}

function addOne() {
  editDialog.value = true;
}

function openView(item: any) {
  viewItem.value = item;
  viewDialog.value = true;
}

function closeView() {
  viewDialog.value = false;
}

function notify(text: string, color?: string) {
  Object.assign(snackbar, {
    active: true,
    text,
    color,
  });
}
</script>

<template>
  <h1>Playlists</h1>

  <v-snackbar :timeout="3000" v-model="snackbar.active" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>

  <v-card class="mx-auto" :loading="pending">
    <v-card-actions>
      <span class="px-4">
        <strong>{{ playlists?.length }}</strong>
        {{
          playlists?.length === 1
            ? "playlist cadastrada"
            : "playlists cadastradas"
        }}
      </span>

      <v-spacer></v-spacer>

      <v-btn @click="addOne()" prepend-icon="mdi-playlist-plus">
        Nova playlist
      </v-btn>

      <v-btn icon @click="refresh()">
        <v-icon icon="mdi-refresh"></v-icon>
      </v-btn>
    </v-card-actions>

    <v-divider></v-divider>

    <v-card-text>
      <v-row>
        <v-col
          v-for="playlist of playlists"
          :key="playlists._id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card variant="outlined">
            <v-img
              class="align-end"
              :src="playlist.thumbnail || '/img/playlist-cover.jpg'"
              height="200px"
              cover
            >
              <v-toolbar color="rgba(0, 0, 0, 0.25)" theme="dark">
                <template v-slot:append>
                  <v-btn icon="mdi-pencil" @click="edit(playlist)"></v-btn>
                  <v-btn icon>
                    <v-icon icon="mdi-delete"></v-icon>

                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item @click="remove(playlist._id)">
                          <v-list-item-title>Excluir</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                </template>
              </v-toolbar>
            </v-img>
            <v-card-title>{{ playlist.title }}</v-card-title>
            <v-card-subtitle> De: {{ playlist.owner.name }} </v-card-subtitle>

            <v-card-text>
              {{ playlist.description || "--" }}
            </v-card-text>

            <v-card-actions class="px-4">
              <p>
                <strong>{{ playlist.items.length }}</strong>
                {{ playlist.items.length === 1 ? "item" : "itens" }}
              </p>

              <v-spacer></v-spacer>

              <v-btn @click="openView(playlist)"> Visualizar playlist </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="viewDialog" :scrim="true" max-width="1024">
    <playlist-dialog-card
      :playlist="viewItem"
      @close="closeView()"
      @success="
        (msg) => {
          notify(msg, 'green');
          refresh();
        }
      "
      @error="
        (msg) => {
          notify(msg, 'red');
          refresh();
        }
      "
    ></playlist-dialog-card>
  </v-dialog>

  <v-dialog v-model="editDialog" persistent>
    <v-card max-width="1024" width="100%" class="mx-auto" :loading="loading">
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editData.title"
                  :counter="255"
                  label="Título"
                  required
                  :rules="[(v) => !!v || 'Título obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="editData.description"
                  clearable
                  :counter="1024"
                  label="Descrição"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editData.thumbnail"
                  :counter="512"
                  label="Thumbnail"
                  hint="URL da imagem"
                  type="url"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editData.owner"
                  :items="users"
                  :hint="`${editData.owner.name}, ${editData.owner.email}`"
                  item-title="name"
                  item-value="_id"
                  label="Usuário"
                  :loading="pendingUsers"
                  persisten-hint
                  return-object
                  single-line
                  required
                  :rules="[(v) => !!v?._id || 'Usuário obrigatório']"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-end">
                <v-btn class="mr-2" @click="closeEdit()"> Cancelar </v-btn>

                <v-btn color="blue" @click="save()"> Salvar </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
