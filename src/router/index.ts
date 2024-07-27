import { createRouter, createWebHistory } from 'vue-router';
import Splash from '@/screens/Splash.vue';
import Home from '@/screens/Home.vue';
import HomeNavigation from '@/screens/home/HomeNavigation.vue';
import Patient from '@/screens/home/Patient.vue';
import Setup from '@/screens/home/Setup.vue';
import Panic from '@/screens/home/Panic.vue';

import Template from '@/screens/demo/Template.vue';
import TemplateNavigation from '@/screens/demo/TemplateNavigation.vue';
import BranchScreen from '@/screens/demo/branching/BranchScreen.vue';
import ChecklistScreen from '@/screens/demo/checklist/ChecklistScreen.vue';

const defaultTransition = { transition: "scale-slide" };

const routes = [
  { path: '/', name: "Splash", component: Splash, meta: { ...defaultTransition } },
  
  // HOME
  { path: '/home', meta: { ...defaultTransition }, component: Home, children:[
    { path: '', name: "Home", component: HomeNavigation, meta: { ...defaultTransition } },
    { path: 'patient', name: "Patient", component: Patient, meta: { ...defaultTransition } },
    { path: 'setup', name: "Setup", component: Setup, meta: { ...defaultTransition } },
    { path: 'panic', name: "Panic", component: Panic, meta: { ...defaultTransition } },
  ]},

  // TEMPLATE
  { path: '/template', component: Template, meta: { ...defaultTransition }, children:[
    { path: '', name: "Template", component: TemplateNavigation, meta: { ...defaultTransition } },
    { path: 'branching', name: "Branching", component: BranchScreen, meta: { ...defaultTransition } },
    { path: 'checklist', name: "Checklist", component: ChecklistScreen, meta: { ...defaultTransition } },
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