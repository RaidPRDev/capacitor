// src/declarations.d.ts
declare module '*.json' {
  const value: any;
  export default value;
}

import 'vue-router'
declare module 'vue-router' {
  interface Router {
    from?: RouteLocationNormalized;
  }
  interface RouteMeta {
    transition?: string;
  }
}