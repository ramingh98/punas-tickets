import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../views/authentication/Login';
import Register from '../views/authentication/Register';

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
        path: '/Authentication/Register',
        component: Register
    },
    // {
    //     path: '/UserPanel', component: Panel, children: [
    //         { path: '', component: () => import('../views/panel/Index') },
    //         { path: 'Profile', name: 'Profile', component: () => import('../views/panel/Profile.vue') },
    //         { path: 'Authentication', component: () => import('../views/panel/Authentication') },
    //         { path: 'Wallet', component: () => import('../views/panel/Wallet') },
    //         { path: 'Transactions', component: () => import('../views/panel/Transactions') },
    //         { path: 'BankCards', component: () => import('../views/panel/BankCards') },
    //         { path: 'BuyAndSell', component: () => import('../views/panel/BuyAndSell') }
    //     ]
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router