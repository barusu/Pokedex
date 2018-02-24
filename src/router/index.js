import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/page/index';
import Azurlane from '@/components/page/azurlane';
import AzurlaneView from '@/components/page/azurlane_view';
import AzurlaneDataCheck from '@/components/page/azurlane_check';

Vue.use(Router);

export default new Router({
  // mode: 'hash', // history hash
  routes: [
    {path: '/index', name: 'index', component: Index},
    {path: '/azurlane', name: 'azurlane', component: Azurlane},
    {path: '/azurlane/data_check', name: 'data_check', component: AzurlaneDataCheck},
    {path: '/azurlane/:code', name: 'azurlane_view', component: AzurlaneView},
    {path: '*', redirect: '/index'}
  ]
});