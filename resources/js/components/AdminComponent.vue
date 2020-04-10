<template>
	<v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          link
          :to="item.action"
        >
          <v-list-item-action>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1">Top 5 Users</v-subheader>
        </v-list-item>
          <v-list-item
            v-for="item in items2"
            :key="item.text"
            link
          >
            <v-list-item-avatar>
              <img
                :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`"
                alt=""
              >
            </v-list-item-avatar>
            <v-list-item-title v-text="item.text" />
          </v-list-item>

      </v-list>
    <v-navigation-drawer height="200" v-model="drawer">
            <v-list>
      <v-list-item nav flat>
        <v-list-item-title>
            <v-switch class="mt-5" v-model="theme" label="Swith Theme"></v-switch>
        </v-list-item-title>
      </v-list-item>
      <v-list-item nav flat @click="logout">
          <v-list-item-action >
            <v-icon color="darken-1">mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-title class="text--light-1">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      color="error"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn text to="/admin" left>
        <v-icon class="mx-4"> mdi-laravel</v-icon>
     
      <v-toolbar-title class="mr-12 align-center">
        <span class="title" >LaraVue Admin</span>
      </v-toolbar-title>
     </v-btn>
      <v-spacer />
      <v-row
        align="center"
        style="max-width: 650px"
      >
      
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="Search..."
          single-line
          append-icon="mdi-glasses"
          hide-details
          color="#fff"
        />
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container class="">
         <router-view></router-view>
        <v-row
          justify="center"
          align="center"
        >
          <v-col>

   			    <v-snackbar
                v-model="snackbar"
              >
                You Are LoggedIn Successfully!
                <v-btn
                  color="error"
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
		 props: {
      source: String,
 
    },
    data: () => ({
      drawer: null,
      snackbar: false,
      theme: true,
      items: [
        { icon: 'account', text: 'Users', action: '/admin/users' },
        { icon: 'post-outline', text: 'Posts', action: '#' },
        { icon: 'circle-edit-outline', text: 'Pages', action: '#' },
        { icon: 'briefcase-edit-outline', text: 'Categories', action: '#' },
        { icon: 'account-badge-outline', text: 'Roles', action: '/admin/roles' },
      ],
      items2: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' },
      ],
    }),
    created () {
      this.$vuetify.theme.dark = true
    },
    mounted(){
       this.snackbar = localStorage.getItem('loggedIn') ? true : false;
       localStorage.removeItem('loggedIn')
    },
    watch:{
      theme: function(old, newval){
        this.$vuetify.theme.dark = old;
      }
    },
    methods:{
      logout: function(){
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        this.$router.push('/login')
           .then(res => {
            this.text = "You are Logged Out Successfully";
            this.snackbar = true;
           })
           .catch(err => console.log(err))
      }
    }
	}
</script>
<style scoped>
.v-btn:before{
  background-color:transparent;
}
a.v-btn--active{
  box-shadow: none;
  border:none;
  background: transparent;
}
</style>