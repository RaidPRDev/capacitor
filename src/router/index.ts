import { createRouter, createWebHistory } from 'vue-router';
import Splash from '@/screens/Splash.vue';
import Home from '@/screens/Home.vue';
import HomeNavigation from '@/screens/home/HomeNavigation.vue';
import Patient from '@/screens/home/Patient.vue';
import Setup from '@/screens/home/Setup.vue';
import Panic from '@/screens/home/Panic.vue';
import BranchScreen from '@/screens/demo/branching/BranchScreen.vue';

const routes = [
  { path: '/', name: "Splash", component: Splash, meta: { transition: "scale-slide" } },
  { path: '/home', meta: { transition: "scale-slide" }, component: Home, children:[
    { path: '', name: "Home", component: HomeNavigation, meta: { transition: "scale-slide" } },
    { path: 'patient', name: "Patient", component: Patient, meta: { transition: "scale-slide" } },
    { path: 'setup', name: "Setup", component: Setup, meta: { transition: "scale-slide" } },
    { path: 'panic', name: "Panic", component: Panic, meta: { transition: "scale-slide" } },
    { path: 'branching', name: "Branching", component: BranchScreen, meta: { transition: "scale-slide" } },
  ]},
]

const router = createRouter({
  history: createWebHistory("/"),
  routes,
})

router.beforeEach((to, from, next) => 
{
  if (false) console.log(to, from);
  next();
})

export default router