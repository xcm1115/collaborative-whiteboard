import { RouteRecordRaw, RouteLocation } from 'vue-router';

const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: '',
    },
  },
  {
    path: '/board/:id',
    name: 'board',
    component: () => import('@/views/Board/index.vue'),
    meta: {
      title: '白板',
    },
  },
];

const routes: RouteRecordRaw[] = [...mainRoutes];

export { mainRoutes, routes };
