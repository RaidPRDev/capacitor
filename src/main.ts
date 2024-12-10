import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";
import AppRouter from '@/_core/AppRouter';
import Device from '@/plugins/Device';
import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";

import './styles/index.scss';

const Pinia = createPinia();
Pinia.use(piniaPluginPersistedstate);

MyClarityCapacitator.initialize({ id: import.meta.env.CLARITY_ID });

// Change Page Layout for Guide Pages...
if (document) {
  const pathname = window.location.pathname;
  if (pathname.indexOf("/guide/apple") > -1 || pathname.indexOf("/guide/android") > -1) {
    document?.getElementById('app')?.classList.add('page-guide');
  }
}

createApp(App)
.use(Device)
.use(Pinia)
.use(AppRouter)
.mount("#app");
