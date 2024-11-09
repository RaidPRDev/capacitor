import { createRouter, createWebHistory, RouteLocationGeneric } from 'vue-router';
import Unauthorized from '@/screens/Unauthorized.vue';
import Splash from '@/screens/Splash.vue';
import Home from '@/screens/Home.vue';
import HomeNavigation from '@/screens/home/HomeNavigation.vue';
import Notes from '@/screens/home/Notes.vue';
import MyCircuit from '@/screens/home/MyCircuit.vue';
import Panic from '@/screens/home/Panic.vue';
import Checklists from '@/screens/home/Checklists.vue';
import Favorites from '@/screens/home/Favorites.vue';
import Medication from '@/screens/home/Medication.vue';
import Calculators from '@/screens/home/Calculators.vue';
import Equipment from '@/screens/home/Equipment.vue';

import Template from '@/screens/demo/Template.vue';
import TemplateNavigation from '@/screens/demo/TemplateNavigation.vue';
import BranchScreen from '@/screens/demo/branching/BranchScreen.vue';
import ChecklistScreen from '@/screens/demo/checklist/ChecklistScreen.vue';
import InputListScreen from '@/screens/demo/inputs/InputListScreen.vue';
import usePassKey from '@/store/passkey.module';
import { BranchRouteProps } from '@/ui/navigation/branching/types';

const DEBUG = false;

const defaultTransition = { transition: "scale-slide" };

type AppRoute = RouteLocationGeneric;

const routes = [
  { path: '/', name: "Splash", component: Splash, meta: { ...defaultTransition } },
  { path: '/unauthorized', name: "Unauthorized", component: Unauthorized, meta: { ...defaultTransition } },
  
  // HOME
  { path: '/home', component: Home, meta: { ...defaultTransition }, children:[
    { path: '', name: "Home", component: HomeNavigation, meta: { ...defaultTransition } },
    { path: 'notes', name: "Notes", component: Notes, meta: { ...defaultTransition } },
    { path: 'circuit', name: "MyCircuit", component: MyCircuit, meta: { ...defaultTransition } },
    { path: 'panic/:id(.*)?', name: "Panic", component: Panic, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'checklists/:id(.*)?', name: "Checklists", component: Checklists, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'medications/:id(.*)?', name: "Medication", component: Medication, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'calculators/:id(.*)?', name: "Calculators", component: Calculators, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'equipment/:id(.*)?', name: "Equipment", component: Equipment, meta: { ...defaultTransition }, props: (route:RouteLocationGeneric) => parseParams(route) },
    { path: 'favorites', name: "Favorites", component: Favorites, meta: { ...defaultTransition } },
  ]},

  // TEMPLATE
  { path: '/template', component: Template, meta: { ...defaultTransition }, children:[
    { path: '', name: "Template", component: TemplateNavigation, meta: { ...defaultTransition } },
    { path: 'branching', name: "Branching", component: BranchScreen, meta: { ...defaultTransition } },
    { path: 'checklist', name: "Checklist", component: ChecklistScreen, meta: { ...defaultTransition } },
    { path: 'input', name: "Input", component: InputListScreen, meta: { ...defaultTransition } },
  ]},
]

const router = createRouter({
  history: createWebHistory("/"),
  routes,
})

router.beforeEach((to, from, next) => {
  
  if (DEBUG) console.log("router.beforeEach()");
  if (DEBUG) console.log("  to", to);
  if (DEBUG) console.log("  from", from);

  // console.log("  import.meta.env.IOS", import.meta.env.IOS);
  if (!import.meta.env.IOS && !import.meta.env.ANDROID) {
    const { isAuthorized } = usePassKey();
  
    if (DEBUG) console.log("  isAuthorized", isAuthorized);
    
    if (!isAuthorized && to.name !== "Unauthorized") {
      next({ name: 'Unauthorized', replace: true });
      return;
    }  
  }

  // save previous route
  router.from = from;

  next();
})

function parseParams(route:RouteLocationGeneric) {
  // console.log("RouterIndex.parseParams", route)

  let parsedParams: any = {};
  if (route.params?.id) {
    const routesFromParams = (route?.params?.id as string).split("/")
    const parentRoute = routesFromParams[0] as string;
    routesFromParams.shift();
    // console.log("routesFromParams", routesFromParams)

    let subRoutes = (routesFromParams.length >= 1) ? routesFromParams : []
    let branchId = (routesFromParams.length >= 1) ? routesFromParams[routesFromParams.length - 1] : parentRoute;
    parsedParams = {
      parentRoute,
      subRoutes, 
      branchId
    }
    // console.log("parsedParams", parsedParams);
  }

  const props = {
    name: route.name,
    fullPath: route.fullPath,
    params: route.params,
    query: route.query,
    redirectedFrom: route.redirectedFrom,
    branchRoute: parsedParams
  }
  
  return props as BranchRouteProps
}

export default router