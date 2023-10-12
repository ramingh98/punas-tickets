import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/authentication/Login';
import AdminLogin from '../views/authentication/AdminLogin';
//import Register from '../views/authentication/Register';
import UserPanel from '../layouts/UserPanel.vue';
import AdminPanel from '../layouts/AdminPanel.vue';

const routes = [
	{
		path: '/', component: UserPanel, children: [
			{ path: '', component: () => import('../views/userPanel/Tickets'), meta: { requiresAuth: true, isAdmin: false, role: 'user' } },
		]
	}, {
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
			{ path: 'Tickets', component: () => import('../views/userPanel/Tickets'), meta: { requiresAuth: true, isAdmin: false, role: 'user' } },
			{ path: 'Ticket/:id', component: () => import('../views/userPanel/Ticket'), meta: { requiresAuth: true, isAdmin: false, role: 'user' } }
		]
	},
	{
		path: '/AdminPanel', component: AdminPanel, children: [
			{ path: 'Users', component: () => import('../views/adminPanel/Users'), meta: { requiresAuth: true, isAdmin: true, role: 'admin' } },
			{ path: 'Tickets', component: () => import('../views/adminPanel/Tickets'), meta: { requiresAuth: true, isAdmin: true, role: 'admin' } },
			{ path: 'Ticket/:id', name: 'Ticket', component: () => import('../views/adminPanel/Ticket'), meta: { requiresAuth: true, isAdmin: true, role: 'admin' } }
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (localStorage.getItem("token") != null) {
			if (to.matched.some(record => record.meta.role == 'admin')) {
				if (localStorage.getItem('role') == 'admin') {
					next();
					return;
				}
				else {
					next('/Authentication/AdminLogin');
				}
			}
			if (to.matched.some(record => record.meta.role == 'user')) {
				if (localStorage.getItem('role') == 'user') {
					next();
					return;
				}
				else {
					next('/Authentication/Login');
				}
			}
			next();
			return;
		} else {
			if (to.matched.some(record => record.meta.isAdmin)) {
				next('/Authentication/AdminLogin');
			} else {
				next('/Authentication/Login');
			}
		}
		next('/signin');
	} else {
		next();
	}
})

export default router;