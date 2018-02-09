import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/page/index';

Vue.use(Router);

export default new Router({
  // mode: 'hash', // history hash
  routes: [
    {path: '/index', name: 'index', component: Index},
    {path: '*', redirect: '/index'}
  ]
});