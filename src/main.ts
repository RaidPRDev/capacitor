import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";
import Device from './plugins/Device';
import Router from './router/index';

import './styles/index.scss';

const Pinia = createPinia();
Pinia.use(piniaPluginPersistedstate);

createApp(App)
.use(Device)
.use(Pinia)
.use(Router)
.mount("#app");
