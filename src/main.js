import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { Button, Message } from 'element-ui';
import './plugins/element';
import XLSX from 'xlsx'

Vue.config.productionTip = false;
Vue.use(XLSX);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
