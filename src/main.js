import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'notyf/notyf.min.css';
import './assets/styles/main.css';

import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import clickOutside from './directives/clickOutside';

import App from './App.vue';
import router from './router';

const app = createApp(App)
const pinia = createPinia()

// 🔥 Use the persisted state plugin
pinia.use(createPersistedState())

app.use(pinia)
app.use(router)
app.directive('click-outside', clickOutside)
app.mount('#app')
