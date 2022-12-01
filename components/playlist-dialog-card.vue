<script setup lang="ts">
import _merge from "lodash-es/merge";

const { playlist } = defineProps({
  playlist: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "success", "error"]);

const form = ref(null as any);
const loading = ref(false);
const { data: medias, pending: pendingMedias } = useLazyFetch("/api/medias");
const {
  data: items = [],
  pending: pendingItems,
  refresh: refreshItems,
} = useLazyFetch(`/api/playlists/${playlist._id}/items`);

const emptyItem = {
  _id: null as any,
  media: null as Record<string, any> | null,
  start: 0,
  end: 0,
  title: "",
};

const editDialog = reactive({
  open: false,
  data: _merge({}, emptyItem),
});
const editRange = ref([editDialog.data.start, editDialog.data.end]);

watch(editRange, (range) => {
  editDialog.data.start = range[0];
  editDialog.data.end = range[1];
});

function edit(item: any = emptyItem) {
  console.log("edit", item);
  editDialog.data = _merge({}, item);
  editRange.value = [editDialog.data.start, editDialog.data.end];
  editDialog.open = true;
}

function closeEdit() {
  editDialog.open = false;
}

async function save() {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      loading.value = true;
      console.log("save", editDialog.data);

      if (editDialog.data._id) {
        const { _id, ...data } = editDialog.data;
        await $fetch(`/api/playlists/${playlist._id}/items/${_id}`, {
          method: "PATCH",
          body: {
            ...data,
            media: data.media?._id,
          },
        });
        emit("success", "Alterações salvas");
      } else {
        await $fetch(`/api/playlists/${playlist._id}/items`, {
          method: "POST",
          body: {
            items: [
              {
                ...editDialog.data,
                media: editDialog.data.media?._id,
              },
            ],
          },
        });
        emit("success", "Mídia cadastrada");
      }
    } catch (err) {
      console.error(err);
      emit("error", "Erro ao salvar alterações");
    } finally {
      loading.value = false;
    }

    closeEdit();
    refreshItems();
  }
}

async function remove(item: any) {
  try {
    await $fetch(`/api/playlists/${playlist._id}/items/${item._id}`, {
      method: "DELETE",
    });
    emit("success", "Item removido");
    refreshItems();
  } catch (err) {
    console.error(err);
    emit("error", "Erro ao salvar mídia");
  }
}

function onMediaChange(media: any) {
  editDialog.data.title = media.title;

  let start = Math.max(0, Math.min(editRange.value[0], media.duration - 1));
  let end = Math.min(editRange.value[1], media.duration);

  if (start === end) {
    end = media.duration;
  }

  editRange.value = [start, end];
}
</script>

<template>
  <v-card width="100%" :loading="pendingItems || pendingMedias">
    <v-img
      :src="playlist.thumbnail || '/img/playlist-cover.jpg'"
      height="200px"
      cover
    >
      <v-toolbar color="rgba(0,0,0,0.25)" theme="dark">
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="emit('close')"></v-btn>
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

      <v-btn flat prepend-icon="mdi-playlist-plus" @click="edit()">
        Adicionar mídia
      </v-btn>
    </v-card-actions>

    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-center"></th>
          <th class="text-left">Título</th>
          <th class="text-left">Fonte</th>
          <th class="text-left">URI</th>
          <th class="text-left">Início</th>
          <th class="text-left">Fim</th>
          <th class="text-left">Duração</th>
          <th class="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td><v-icon icon="mdi-motion-play-outline"></v-icon></td>
          <td>{{ item.title }}</td>
          <td>{{ item.media.source }}</td>
          <td>{{ item.media.uri }}</td>
          <td>{{ item.start }}</td>
          <td>{{ item.end }}</td>
          <td>{{ item.duration }}</td>
          <td class="d-flex align-center">
            <v-btn icon="mdi-pencil" size="small" flat @click="edit(item)">
            </v-btn>
            <v-btn icon size="small" flat>
              <v-icon icon="mdi-delete"></v-icon>

              <v-menu activator="parent">
                <v-list>
                  <v-list-item @click="remove(item)">
                    <v-list-item-title>Excluir</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </td>
        </tr>
      </tbody></v-table
    >
  </v-card>

  <v-dialog v-model="editDialog.open" persistent max-width="1024">
    <v-card width="100%">
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editDialog.data.media"
                  @update:model-value="onMediaChange"
                  :items="medias"
                  :loading="pendingMedias"
                  label="Mídia"
                  required
                  :rules="[(v) => !!v || 'Mídia obrigatória']"
                  return-object
                  item-title="title"
                  item-value="_id"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editDialog.data.title"
                  :disabled="!editDialog.data.media"
                  :counter="255"
                  label="Título"
                  required
                  :rules="[(v) => !!v || 'Título obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-range-slider
                  v-model="editRange"
                  :disabled="!editDialog.data.media"
                  step="1"
                  strict
                  :min="0"
                  :max="editDialog.data.media?.duration"
                  :rules="[([s, e]: any) => (e-s) > 0 || 'Início deve ser menor que o fim']"
                >
                  <template v-slot:prepend>
                    <strong>{{ editDialog.data.start }}</strong>
                  </template>

                  <template v-slot:append>
                    <strong>{{ editDialog.data.end }}</strong>
                  </template>
                </v-range-slider>
              </v-col>
              <v-col cols="12" sm="6"></v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-end">
                <v-btn class="mr-2" @click="closeEdit()"> Cancelar </v-btn>

                <v-btn
                  color="blue"
                  @click="save()"
                  :disabled="!editDialog.data.media"
                >
                  Salvar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
