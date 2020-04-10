<template>
  <v-app id="inspire">
    <v-data-table
      item-key="name"
      class="elevation-1"
      color="error"
      :loading="loading"
      loading-text="Loading... Please wait"
      :headers="headers"
      @pagination="paginate"
      :server-items-length="users.total"
      :options.sync="options"
      :items="users.data"
      :items-per-page="5"
      show-select
      @input="selectAll"
      :footer-props="{
      itemsPerPageOptions: [5,10,15],
      itemsPerPageText: 'users Per Page',
      'show-current-page': true,
      'show-first-last-page': true
    }"
    >
      <template v-slot:top>
        <v-toolbar flat color="dark">
          <v-toolbar-title>User Management System</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="error" dark class="mb-2" v-on="on">Add New user</v-btn>
              <v-btn color="error" dark class="mb-2 mr-2" @click="deleteAll">Delete</v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-form v-model="valid" method="post" v-on:sumbit.stop.prevent="save">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          color="error"
                          v-model="editedItem.name"
                          label="Name"
                          :rules="[rules.required, rules.min]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row v-if="editedIndex == -1">
                      <v-col cols="12" sm="12">
                        <v-text-field
                          :rules="[rules.required]"
                          type="password"
                          color="error"
                          v-model="editedItem.password"
                          label="Type Password"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          :rules="[rules.required, passwordMatch]"
                          type="password"
                          color="error"
                          v-model="editedItem.rpassword"
                          label="Retype Password"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          type="email"
                          :success-messages="success"
                          :error-messages="error"
                          :rules="[rules.required, rules.validEmail]"
                          @blur="checkEmail"
                          color="error"
                          v-model="editedItem.email"
                          autocomplete="off"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-select
                          :rules="[rules.required]"
                          :items="roles"
                          v-model="editedItem.role"
                          color="error"
                          label="Select Role"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
                  <v-btn
                    type="submit"
                    :disabled="!valid"
                    color="error darken-1"
                    text
                    @click.prevent="save"
                  >Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-row>
          <v-col cols="12">
            <v-text-field color="#ff5252" @input="searchIt" label="Search..." class="mx-4"></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.role="{ item }">
        <v-edit-dialog
          large
          block
          persistent
          :return-value.sync="item.role"
          @save="updateRole(item)"
        >
          {{item.role}}
          <template v-slot:input>
            <h4>Change Role</h4>
            <v-select
              :rules="[rules.required]"
              :items="roles"
              v-model="item.role"
              color="error"
              label="Select Role"
            ></v-select>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.photo="{ item }">
        <v-edit-dialog>
          <v-list-item-avatar>
            <v-img :src="item.photo" aspect-ratio="1" class="grey lighten-2"></v-img>
          </v-list-item-avatar>
          <template v-slot:input>
            <v-file-input
              v-model="editedItem.photo"
              label="Select File"
              placeholder="Upload Avatar"
              accept="image/jpg, image/png, image/bmp, image/jpeg"
              @change="uploadPhoto(item)"
            />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-content-save-edit-outline</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="error" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
      {{text}}
      <v-btn color="error" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    dialog: false,
    loading: false,
    snackbar: false,
    selected: [],
    text: "",
    roles: [],
    success: "",
    error: "",
    options: {
      sortBy: ["name"],
      sortDesc: [true]
    },
    rules: {
      required: v => !!v || "This Field is Required",
      min: v => v.length >= 5 || "Minimum 5 Chracters Required",
      validEmail: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    },
    headers: [
      { text: "#", align: "left", sortable: false, value: "id" },
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Role", value: "role" },
      { text: "Photo", value: "photo" },
      { text: "Created At", value: "created_at" },
      { text: "Updated At", value: "updated_at" },
      { text: "Actions", value: "action" }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      email: "",
      role: "",
      password: "",
      photo: null
    },
    defaultItem: {
      id: "",
      name: "",
      email: "",
      role: "",
      photo: "",
      created_at: "",
      updated_at: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    },
    passwordMatch() {
      return this.editedItem.password != this.editedItem.rpassword
        ? "Password Does Not Match"
        : true;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    uploadPhoto(item) {
      if (this.editedItem.photo != null) {
        const index = this.users.data.indexOf(item);
        let formData = new FormData();
        formData.append(
          "photo",
          this.editedItem.photo,
          this.editedItem.photo.name
        );
        formData.append("user", item.id);
        axios
          .post("/api/user/photo", formData)
          .then(res => {
            this.users.data[index].photo = res.data.user.photo;
            this.editedItem.photo = null;
          })
          .catch(err => console.log(err.response));
      }
    },
    updateRole(item) {
      const index = this.users.data.indexOf(item);
      axios
        .post("/api/user/role", { role: item.role, user: item.id })
        .then(res => {
          this.text =
            res.data.user.name + "'s Role Updated to " + res.data.user.role;
          this.snackbar = true;
        })
        .catch(error => {
          this.text =
            error.response.data.user.name +
            "'s Role Cannot Be Updated to " +
            error.response.data.user.role;
          this.users.data[index].role = error.response.data.user.role;
          this.snackbar = true;
        });
    },
    checkEmail() {
      if (/.+@.+\..+/.test(this.editedItem.email)) {
        axios
          .post("/api/email/verify", { email: this.editedItem.email })
          .then(res => {
            this.success = res.data.message;
            this.error = "";
          })
          .catch(err => {
            this.success = "";
            this.error = "Email Already Exists";
          });
      }
    },
    selectAll(e) {
      this.selected = [];
      if (e.length > 0) {
        this.selected = e.map(val => val.id);
      }
    },
    deleteAll() {
      let decide = confirm("Are you sure you want to delete these items?");
      if (decide) {
        axios
          .post("/api/users/delete", { users: this.selected })
          .then(res => {
            this.text = "Records Deleted Successfully!";
            this.selected.map(val => {
              const index = this.users.indexOf(val);
              this.users.splice(index, 1);
            });
            this.snackbar = true;
          })
          .catch(err => {
            console.log(err.response);
            this.text = "Error Deleting Record";
            this.snackbar = true;
          });
      }
    },
    searchIt(e) {
      if (e.length > 3) {
        axios
          .get(`/api/users/${e}`)
          .then(res => (this.users = res.data.users))
          .catch(err => console.dir(err.response));
      }
      if (e.length <= 0) {
        axios
          .get(`/api/users`)
          .then(res => (this.users = res.data.users))
          .catch(err => console.dir(err.response));
      }
    },
    paginate(e) {
      const sortBy =
        this.options.sortBy.length == 0 ? "name" : this.options.sortBy[0];
      const orderBy =
        this.options.sortDesc.length > 0 && this.options.sortDesc[0]
          ? "asc"
          : "desc";
      axios
        .get(`/api/users?page=${e.page}`, {
          params: {
            per_page: e.itemsPerPage,
            sort_by: sortBy,
            order_by: orderBy
          }
        })
        .then(res => {
          this.users = res.data.users;
          this.roles = res.data.roles;
        })
        .catch(err => {
          if (err.response.status == 401) localStorage.removeItem("token");
          this.$router.push("/login");
        });
    },
    initialize() {
      // Add a request interceptor
      axios.interceptors.request.use(
        config => {
          this.loading = true;
          return config;
        },
        error => {
          this.loading = false;
          return Promise.reject(error);
        }
      );
      // Add a response interceptor
      axios.interceptors.response.use(
        response => {
          this.loading = false;
          return response;
        },
        error => {
          this.loading = false;
          return Promise.reject(error);
        }
      );
    },

    editItem(item) {
      this.editedIndex = this.users.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.users.data.indexOf(item);
      let decide = confirm("Are you sure you want to delete this item?");
      if (decide) {
        axios
          .delete("/api/users/" + item.id)
          .then(res => {
            this.text = "Record Deleted Successfully!";
            this.snackbar = true;
            this.users.data.splice(index, 1);
          })
          .catch(err => {
            console.log(err.response);
            this.text = "Error Deleting Record";
            this.snackbar = true;
          });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        const index = this.editedIndex;
        axios
          .put("/api/users/" + this.editedItem.id, this.editedItem)
          .then(res => {
            this.text = "Record Updated Successfully!";
            this.snackbar = true;
            Object.assign(this.users.data[index], res.data.user);
          })
          .catch(err => {
            console.log(err.response);
            this.text = "Error Updating Record";
            this.snackbar = true;
          });
        // Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        axios
          .post("/api/users", this.editedItem)
          .then(res => {
            this.text = "Record Added Successfully!";
            this.snackbar = true;
            this.users.data.push(res.data.user);
          })
          .catch(err => {
            console.dir(err);
            this.text = "Error Inserting Record";
            this.snackbar = true;
          });
      }
      this.close();
    }
  }
};
</script>
<style scoped></style>