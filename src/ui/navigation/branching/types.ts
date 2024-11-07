import { IBaseButtonProps } from "@/ui/types";
import { LocationQueryRaw, RouteLocation, RouteParamsGeneric } from "vue-router";

export type CalculatorParamType = Record<string, any>;

export type BranchDataQuery = { 
  type: string,
  id: string,
  childId?: string,
}

/**
 * @property 0  - type
 * @property 1  - parent id
 * @property 2? - child id
 */
export type BranchUID = string[] & {
  0: string;      // type
  1: string;      // parent id
  2?: string;     // child id
};

export interface BranchItem {
  id: string;
  parentId: string;
  label: string;
  class: string;
  items: string;
  branchTo: string | null;
}

export interface BranchViewData {
  id?: string;
  parentId?: string;
  component?: any;
  type?: string;
  dataType?: string;  // json data name
  heading?: string;
  title?: string;
  content?: string;
  layout?: string;
  items?: BranchItem[];
  branchTo?: string | null;
  useNav?: boolean;
  useScroll?: boolean;
  showTitle?: boolean;
  showFavorites?: boolean;
  showRestart?: boolean;
  isRootParent?: boolean;
  parentView?: BranchViewData;
  checked?: boolean;
}

export interface BranchViewOptions {
  showBreadcrumbs?: boolean;
}

export interface BranchRouteProps {
  name: string,
  fullPath: string,
  params: RouteParamsGeneric,
  query: LocationQueryRaw,
  redirectedFrom: RouteLocation | undefined,
  branchRoute: BranchRouteParams
}

export interface BranchRouteParams {
  parentRoute: string;
  subRoutes: string[];
  branchId: string;
}

export type BranchViewParamData = { 
  selectedIndex: number;
  view: BranchViewData;
  previousViewIndex: number;
  previousView: BranchViewData;
  breadcrumbData?: IBaseBreadcrumbProps
};

export type BranchViewChangeOptions = null | { 
  __baseHeight?: number;
  heightPadding?: number;
  hasBreadcrumbs?: boolean;
};

export interface IBranchNavButtonProps {
  disabled: boolean;
  buttonProps?: IBaseButtonProps;
  label?: string;
  icon?: any;
  data?: Record<string, any>;
}

export interface IBreadcrumbItem { 
  id?: string;
  title?: string;
  heading?: string;
}

export interface IBaseBreadcrumbProps {
  useTruncate?: boolean;
  padding?: number;
  items?: Array<IBreadcrumbItem>;
}

export interface IBranchTypeProps {
  view: BranchViewData | null;
  showTitle?: boolean;
  showRestart?: boolean;
  showFavorites?: boolean;
}

