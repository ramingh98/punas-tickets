import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../views/authentication/Login';
import AdminLogin from '../views/authentication/AdminLogin';
//import Register from '../views/authentication/Register';
import UserPanel from '../layouts/UserPanel.vue';
import AdminPanel from '../layouts/AdminPanel.vue';

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/Authentication/Login',
		component: Login
	},
	{
		path: '/Authentication/AdminLogin',
		component: AdminLogin
	},
	// {
	// 	path: '/Authentication/Register',
	// 	component: Register
	// },
	{
		path: '/UserPanel', component: UserPanel, children: [
			{ path: 'Tickets', component: () => import('../views/userPanel/Tickets') },
			{ path: 'Ticket/:id', component: () => import('../views/userPanel/Ticket') }
		]
	},
	{
		path: '/AdminPanel', component: AdminPanel, children: [
			{ path: 'Tickets', component: () => import('../views/adminPanel/Tickets') },
			{ path: 'Ticket/:id', name: 'Ticket', component: () => import('../views/adminPanel/Ticket') }
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router