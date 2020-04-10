import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from './components/LoginComponent';
import AdminComponent from './components/AdminComponent';
import RolesComponent from './components/RolesComponent';
import UserComponent from './components/UserComponent';
import RegisterComponent from './components/RegisterComponent';
Vue.use(VueRouter)

const routes = [
{
	path: '/',
	redirect: '/login'
},
{
	path: '/register',
	component: RegisterComponent,
	name: 'Register'
},
{
	path: '/login',
	component: LoginComponent,
	name: 'Login'
},
{
	path: '/admin',
	component: AdminComponent,
	name: 'Admin',
	children: [
	{
		path: 'roles',
		component: RolesComponent,
		name: 'Roles'
	},
	{
		path: 'users',
		component: UserComponent,
		name: 'Users'
	},
	],
	beforeEnter: (to, from, next) => {
	   axios.get('api/verify')
	   .then(res => next())
	   .catch(err => next('/login') )
       
    }
}
]
const router = new VueRouter({routes})
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token') || null
  	window.axios.defaults.headers['Authorization'] = "Bearer " + token;
  	next();
})

export default router