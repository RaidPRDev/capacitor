import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";
import AppRouter from '@/_core/AppRouter';
import Device from './plugins/Device';
import Clarity from './plugins/clarity/Clarity';

import './styles/index.scss';

const Pinia = createPinia();
Pinia.use(piniaPluginPersistedstate);

const isMobileDevice = import.meta.env.PLATFORM !== "web";

createApp(App)
.use(Device)
.use(Clarity, { ID: "oztc10g5eg", enabled: isMobileDevice })
.use(Pinia)
.use(AppRouter)
.mount("#app");
