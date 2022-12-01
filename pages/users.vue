<script setup lang="ts">
import { Ref } from "vue";
import _merge from "lodash-es/merge";
const { data: users, pending, refresh } = useLazyFetch("/api/users");

const emptyUser = {
  _id: undefined as string | undefined,
  name: "",
  username: "",
  email: "",
  address: {
    country: "",
    state: "",
    city: "",
    street: "",
    post_code: "",
  },
};

const form: Ref<any> = ref(null);
const editDialog = ref(false);
const loading = ref(false);
const editData = reactive(_merge({}, emptyUser));
const snackbar = reactive({
  active: false,
  text: null as string | null,
  color: "",
});

async function remove(id: string) {
  await useFetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  await refresh();
}

async function edit(user: any) {
  _merge(editData, user);
  editDialog.value = true;
}

async function save() {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      loading.value = true;

      if (editData._id) {
        const { _id, ...data } = editData;
        await $fetch(`/api/users/${_id}`, {
          method: "PATCH",
          body: data,
        });
        notify("Alterações salvas", "green");
        refresh();
      } else {
        await $fetch(`/api/users`, {
          method: "POST",
          body: editData,
        });
        notify("Usuário cadastrado", "green");
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
  _merge(editData, emptyUser);
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

function getAddressText(user: any) {
  const { address } = user;
  return [
    address.street,
    address.city,
    address.state,
    address.country,
    address.post_code,
  ]
    .filter(Boolean)
    .join(", ");
}
</script>

<template>
  <h1>Usuários</h1>

  <v-snackbar :timeout="3000" v-model="snackbar.active" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>

  <v-card class="mx-auto" :loading="pending">
    <v-card-title></v-card-title>

    <v-card-actions>
      <span class="px-4">
        <strong>{{ users?.length }}</strong>
        {{
          users?.length === 1 ? "usuário cadastrado" : "usuários cadastrados"
        }}
      </span>

      <v-spacer></v-spacer>

      <v-btn @click="addOne()" prepend-icon="mdi-account-plus">
        Novo usuário
      </v-btn>

      <v-btn icon @click="refresh()">
        <v-icon icon="mdi-refresh"></v-icon>
      </v-btn>
    </v-card-actions>

    <v-divider></v-divider>

    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Nome</th>
          <th class="text-left">Nome de usuário</th>
          <th class="text-left">Email</th>
          <th class="text-left">Endereço</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user._id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ getAddressText(user) }}</td>
          <td>
            <div class="d-flex">
              <v-btn icon @click="edit(user)">
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon icon="mdi-delete"></v-icon>

                <v-menu activator="parent">
                  <v-list>
                    <v-list-item @click="remove(user._id)">
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

  <v-dialog v-model="editDialog" persistent>
    <v-card max-width="1024" width="100%" class="mx-auto" :loading="loading">
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editData.name"
                  :counter="255"
                  label="Nome"
                  required
                  :rules="[(v) => !!v || 'Nome obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" lg="6">
                <v-text-field
                  v-model="editData.username"
                  :counter="255"
                  label="Nome de usuário"
                  required
                  :rules="[(v) => !!v || 'Nome de usuário obrigatório']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  v-model="editData.email"
                  :counter="255"
                  label="Email"
                  type="email"
                  required
                  :rules="[(v) => !!v || 'Email obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <h4 class="pt-4 pb-2">Endereço</h4>

            <v-row class="align-center">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="editData.address.country"
                  label="País"
                  required
                  :rules="[(v) => !!v || 'País obrigatório']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="editData.address.state"
                  label="Estado"
                  required
                  :rules="[(v) => !!v || 'Estado obrigatório']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editData.address.city"
                  label="Cidade"
                  required
                  :rules="[(v) => !!v || 'Cidade obrigatória']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="7">
                <v-text-field
                  v-model="editData.address.street"
                  label="Logradouro"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="editData.address.post_code"
                  label="Código postal"
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
