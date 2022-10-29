import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

import { useTitle } from '@vueuse/core';

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const title = useTitle();

const getPageTitle = (pageTitle: string) => {
  if (pageTitle) {
    return `${pageTitle} - ${import.meta.env.VITE_APP_NAME}`;
  }

  return `${import.meta.env.VITE_APP_NAME}`;
};

router.beforeEach((to, from) => {
  if (to.meta?.title && to.meta.title !== from.meta?.title) {
    title.value = getPageTitle(to.meta.title as string);
  }
});

export default router;
