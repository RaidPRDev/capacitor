import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";
import AppRouter from '@/_core/AppRouter';
import Device from '@/plugins/Device';

import './styles/index.scss';

const Pinia = createPinia();
Pinia.use(piniaPluginPersistedstate);

createApp(App)
.use(Device)
.use(Pinia)
.use(AppRouter)
.mount("#app");
