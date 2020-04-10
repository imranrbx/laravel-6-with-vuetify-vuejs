<template>
	<v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="error"
                dark
                flat
              >
                <v-toolbar-title>Register Form</v-toolbar-title>
                <v-spacer />
               
              </v-toolbar>
              <v-card-text>
                <v-progress-linear
                    :active="loading"
                    :indeterminate="loading"
                    absolute
                    top
                    color="white accent-4"
                  ></v-progress-linear>
                <v-form
                  v-model="valid"
                  method="post"
                  v-on:sumbit.stop.prevent="register"
                  
                >
                <v-text-field color="error"
                    label="Name"
                    name="name"
                    v-model="name"
                    required
                    prepend-icon="mdi-account-circle-outline"
                    
                  />
                  <v-text-field color="error"
                    label="E-mail"
                    name="register"
                    v-model="email"
                    :rules="emailRules"
                    @blur="checkEmail"
                    :error-messages="errors"
                    :success-messages="success"
                    required
                    prepend-icon="mdi-email-search-outline"
                    type="email"
                  />

                  <v-text-field color="error"
                    id="password"
                    label="Password"
                    v-model="password"
                    name="password"
                    prepend-icon="mdi-account-lock"
                    type="password"
                    :rules="passwordRules"
                    required
                  />
                   <v-text-field color="error"
                    id="password"
                    label="Retype Password"
                    v-model="rpassword"
                    name="rpassword"
                    prepend-icon="mdi-account-lock-outline"
                    type="password"
                    :rules="[passwordMatch]"
                    required
                  />
                  <v-card-actions>
                <v-spacer />
                <v-btn type="submit" color="error" :disabled="!valid" block @click.prevent="register">register</v-btn>
              </v-card-actions>
                </v-form>
                 <v-row
          align="center"
          justify="center"
        >
               <v-btn text right to="login">Login Here...</v-btn>
             </v-row>
              </v-card-text>
              
            </v-card>
            <v-snackbar
                v-model="snackbar"
              >
                {{ text }}
                <v-btn
                  color="pink"
                  text
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
	export default{
		data: () => ({
        valid: true,
				email: '',
        name:'',
        rpassword:'',
        errors:'',
        success:'',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
				password: '',
        passwordRules: [
          v => !!v || 'Password is required',
        ],
        loading: false,
        snackbar: false,
        text: '',
		}),
    created(){
      this.$vuetify.theme.dark = true;
    },
    computed:{
      passwordMatch(){
        return this.password != this.rpassword ? 'Password Does Not Match' : true
      },
    },
		methods:{
      checkEmail(){
        if (/.+@.+\..+/.test(this.email)){
          axios.post('/api/email/verify', {'email': this.email})
          .then(res => {
            this.success = res.data.message
            this.errors = '';
          })
          .catch(err => {
            this.success = '';
            this.errors = 'Email Already Exists'
          })
        }
      },
			register: function(){
        
        // Add a request interceptor
        axios.interceptors.request.use((config) => {
            this.loading = true;
            return config;
          },  (error) => {
            this.loading = false;
            return Promise.reject(error);
          });

        // Add a response interceptor
        axios.interceptors.response.use( (response) => {
           this.loading = false;
            return response;
          },  (error) => {
           this.loading = false
            return Promise.reject(error);
          });
         axios.post('/api/users', {'name': this.name, 'email': this.email, 'password': this.password, 'rpassword': this.rpassword})
          .then(res =>  {
            this.text = "Record Added Successfully!";
            this.snackbar=true;
            this.$router.push('/login');            
          })
          .catch(err => {
            console.dir(err)
             this.text = "Error Inserting Record"
             this.snackbar=true
          })
				
			}
		}
	}
</script>
<style scoped></style>