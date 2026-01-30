import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PoetryLibrary from '../views/PoetryLibrary.vue';
import PoetryDetail from '../views/PoetryDetail.vue';
import Favorites from '../views/Favorites.vue';
import FamousLines from '../views/FamousLines.vue';
import Authors from '../views/Authors.vue';
import AuthorDetail from '../views/AuthorDetail.vue';
import PoetryAppreciation from '../views/PoetryAppreciation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/library',
    name: 'Library',
    component: PoetryLibrary
  },
  {
    path: '/poetry/:id',
    name: 'PoetryDetail',
    component: PoetryDetail,
    props: true
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/famous-lines',
    name: 'FamousLines',
    component: FamousLines
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors
  },
  {
    path: '/author/:id',
    name: 'AuthorDetail',
    component: AuthorDetail,
    props: true
  },
  {
    path: '/appreciation',
    name: 'Appreciation',
    component: PoetryAppreciation
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;