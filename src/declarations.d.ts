// src/declarations.d.ts
declare module '*.json' {
  const value: any;
  export default value;
}

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    transition?: string;
  }
}