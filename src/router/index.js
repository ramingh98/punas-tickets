import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../views/authentication/Login';
//import Register from '../views/authentication/Register';
import UserPanel from '../layouts/UserPanel.vue';

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
	// {
	// 	path: '/Authentication/Register',
	// 	component: Register
	// },
	{
		path: '/UserPanel', component: UserPanel, children: [
			{ path: 'Tickets', component: () => import('../views/panel/Tickets') },
			{ path: 'Ticket/:id', name: 'Ticket', component: () => import('../views/panel/Ticket') }
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router