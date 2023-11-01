import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/readable',
            name: 'readable',
            component: () => import('../views/ReadableView.vue'),
        },
        {
            path: '/optimized',
            name: 'optimized',
            component: () => import('../views/OptimizedView.vue'),
        },
        {
            path: '/extendible',
            name: 'extendible',
            component: () => import('../views/ExtendibleView.vue'),
        },
    ],
});

export default router;
