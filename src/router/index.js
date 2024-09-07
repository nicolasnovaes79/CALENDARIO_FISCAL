import { createRouter, createWebHistory } from 'vue-router';

import faturamento from '../assets/pages/calendario/calendario.vue';



const routes = [
    { path: '/faturamento', component: faturamento },

  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;

