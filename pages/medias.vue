<script setup lang="ts">
import { Ref } from "vue";
import _merge from "lodash-es/merge";
const { data: medias, pending, refresh } = useLazyFetch("/api/medias");

const emptyMedia = {
  _id: undefined as string | undefined,
  title: "",
  source: "",
  duration: 0,
  uri: "",
  metadata: {
    views: 0,
    likes: 0,
    dislikes: 0,
  },
};

const form: Ref<any> = ref(null);
const editDialog = ref(false);
const loading = ref(false);
const editData = reactive(_merge({}, emptyMedia));
const snackbar = reactive({
  active: false,
  text: null as string | null,
  color: "",
});

async function remove(id: string) {
  await useFetch(`/api/medias/${id}`, {
    method: "DELETE",
  });
  await refresh();
}

async function edit(media: any) {
  _merge(editData, media);
  editDialog.value = true;
}

async function save() {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      loading.value = true;

      if (editData._id) {
        const { _id, ...data } = editData;
        await $fetch(`/api/medias/${_id}`, {
          method: "PATCH",
          body: data,
        });
        notify("Alterações salvas", "green");
        refresh();
      } else {
        await $fetch(`/api/medias`, {
          method: "POST",
          body: editData,
        });
        notify("Mídia cadastrada", "green");
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
  _merge(editData, emptyMedia);
  editDialog.value = false;
}

function addOne() {
  editDialog.value = true;
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
  <h1>Mídias</h1>

  <v-snackbar :timeout="3000" v-model="snackbar.active" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>

  <v-card class="mx-auto" :loading="pending">
    <v-card-title></v-card-title>

    <v-card-actions>
      <span class="px-4">
        <strong>{{ medias?.length }}</strong>
        {{ medias?.length === 1 ? "mídia cadastrada" : "mídias cadastradas" }}
      </span>

      <v-spacer></v-spacer>

      <v-btn @click="addOne()" prepend-icon="mdi-plus"> Nova mídia </v-btn>

      <v-btn icon @click="refresh()">
        <v-icon icon="mdi-refresh"></v-icon>
      </v-btn>
    </v-card-actions>

    <v-divider></v-divider>

    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Título</th>
          <th class="text-left">Fonte</th>
          <th class="text-left">URI</th>
          <th class="text-left">Duração</th>
          <th class="text-left">Views</th>
          <th class="text-left">Likes</th>
          <th class="text-left">Dislikes</th>
          <th class="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="media in medias" :key="media._id">
          <td>{{ media._id }}</td>
          <td>{{ media.title }}</td>
          <td>{{ media.source }}</td>
          <td>{{ media.uri }}</td>
          <td>{{ media.duration }}</td>
          <td>{{ media.metadata.views }}</td>
          <td>{{ media.metadata.likes }}</td>
          <td>{{ media.metadata.dislikes }}</td>
          <td>
            <div class="d-flex">
              <v-btn icon flat size="small" @click="edit(media)">
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
              <v-btn icon flat size="small">
                <v-icon icon="mdi-delete"></v-icon>

                <v-menu activator="parent">
                  <v-list>
                    <v-list-item @click="remove(media._id)">
                      <v-list-item-title>Excluir</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <v-dialog v-model="editDialog" max-width="1024" persistent>
    <v-card width="100%" :loading="loading">
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
              <v-col cols="12" lg="6">
                <v-text-field
                  v-model="editData.source"
                  :counter="80"
                  label="Fonte"
                  required
                  :rules="[(v) => !!v || 'Fonte obrigatória']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  v-model="editData.uri"
                  :counter="255"
                  label="URI"
                  required
                  :rules="[(v) => !!v || 'URI obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="align-center">
              <v-col cols="12" md="3" sm="6">
                <v-text-field
                  v-model="editData.duration"
                  label="Duração"
                  type="number"
                  required
                  min="1"
                  :rules="[
                    (v) => !!v || 'Duração obrigatória',
                    (v) => v > 0 || 'Duração deve ser positiva',
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" sm="6">
                <v-text-field
                  v-model="editData.metadata.views"
                  label="Views"
                  type="number"
                  min="0"
                  :rules="[(v) => v >= 0 || 'Views não pode ser negativo']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" sm="6">
                <v-text-field
                  v-model="editData.metadata.likes"
                  label="Likes"
                  type="number"
                  min="0"
                  :rules="[(v) => v >= 0 || 'Likes não pode ser negativo']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" sm="6">
                <v-text-field
                  v-model="editData.metadata.dislikes"
                  label="Dislikes"
                  type="number"
                  min="0"
                  :rules="[(v) => v >= 0 || 'Dislikes não pode ser negativo']"
                ></v-text-field>
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
