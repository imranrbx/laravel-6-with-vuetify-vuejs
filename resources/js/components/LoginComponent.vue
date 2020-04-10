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
                <v-toolbar-title>Login Form</v-toolbar-title>
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
                  v-on:sumbit.stop.prevent="login"
                  
                >
                  <v-text-field color="error"
                    label="E-mail"
                    name="login"
                    v-model="email"
                    :rules="emailRules"
                    required
                    prepend-icon="mdi-account-circle-outline"
                    type="email"
                  />

                  <v-text-field color="error"
                    id="password"
                    label="Password"
                    v-model="password"
                    name="password"
                    prepend-icon="mdi-account-lock-outline"
                    type="password"
                    :rules="passwordRules"
                    required
                  />


                  <v-card-actions>

                <v-spacer />

                <v-btn block type="submit" color="error" :disabled="!valid" block @click.prevent="login">Login</v-btn>


              </v-card-actions>
                </v-form>
                  <v-row
          align="center"
          justify="center"
        >
               <v-btn text right to="register">Register Here...</v-btn>
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
		methods:{
			login: function(){
        
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
        axios.post('/api/login',{'email': this.email, 'password': this.password})
        .then(res => {
           localStorage.setItem('token',res.data.token)
           localStorage.setItem('loggedIn', true)
           if(res.data.isAdmin){
                this.$router.push('/admin')
                .then(res => console.log('LoggedIn Successfully'))
                .catch(err => console.log(err))
           }else{
            this.text = "You Need to be LoggedIn as an Administrator";
            this.snackbar = true
           }

        })
        .catch( err => {
           this.text = err.response.data.status
           this.snackbar = true;
        })
				
			}
		}
	}
</script>
<style scoped></style>