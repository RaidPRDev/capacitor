import { createRouter, createWebHistory, RouteLocationGeneric } from 'vue-router';
import AppHome from '@/AppHome.vue';
import Unauthorized from '@/screens/Unauthorized.vue';
import Splash from '@/screens/Splash.vue';
import HomeMenu from '@/screens/HomeMenu.vue';
import Notes from '@/screens/Notes.vue';
import MyCircuit from '@/screens/MyCircuit.vue';
import Panic from '@/screens/Panic.vue';
import Checklists from '@/screens/Checklists.vue';
import Favorites from '@/screens/Favorites.vue';
import Medication from '@/screens/Medication.vue';
import Calculators from '@/screens/Calculators.vue';
import Equipment from '@/screens/Equipment.vue';
import Resources from '@/screens/Resources.vue';
import EcmoCandidacy from '@/screens/EcmoCandidacy.vue';

import Template from '@/screens/demo/Template.vue';
import TemplateNavigation from '@/screens/demo/TemplateNavigation.vue';
import BranchScreen from '@/screens/demo/branching/BranchScreen.vue';
import ChecklistScreen from '@/screens/demo/checklist/ChecklistScreen.vue';
import InputListScreen from '@/screens/demo/inputs/InputListScreen.vue';
import usePassKey from '@/store/passkey.module';
import { BranchRouteProps } from '@/types';

const DEBUG = false;

const defaultTransition = { transition: "scale-slide", scrollPos: 0 };

type AppRoute = RouteLocationGeneric;

const routes = [
  { path: '/', name: "Splash", component: Splash, meta: { ...defaultTransition } },
  { path: '/unauthorized', name: "Unauthorized", component: Unauthorized, meta: { ...defaultTransition } },
  
  // HOME
  { path: '/home', component: AppHome, meta: { ...defaultTransition }, children:[
    { path: '', name: "Home", component: HomeMenu, meta: { ...defaultTransition } },
    { path: 'notes', name: "Notes", component: Notes, meta: { ...defaultTransition } },
    { path: 'circuit', name: "MyCircuit", component: MyCircuit, meta: { ...defaultTransition } },
    { path: 'ecmo/:id(.*)?', name: "EcmoCandidacy", component: EcmoCandidacy, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'panic/:id(.*)?', name: "Panic", component: Panic, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'checklists/:id(.*)?', name: "Checklists", component: Checklists, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'medications/:id(.*)?', name: "Medication", component: Medication, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'calculators/:id(.*)?', name: "Calculators", component: Calculators, meta: { ...defaultTransition }, props: (route:AppRoute) => parseParams(route) },
    { path: 'equipment/:id(.*)?', name: "Equipment", component: Equipment, meta: { ...defaultTransition }, props: (route:RouteLocationGeneric) => parseParams(route) },
    { path: 'resources/:id(.*)?', name: "Resources", component: Resources, meta: { ...defaultTransition }, props: (route:RouteLocationGeneric) => parseParams(route) },
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