import { IBaseButtonProps } from "@/ui/types";
import { LocationQueryRaw, RouteLocation, RouteParamsGeneric } from "vue-router";

/////////////////////////////////////////////////////////////////////
// APP
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export interface IApp {
  device: {
    width: number;
    height: number;
    margin: number;
    mobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
  };
  alert: IAppAlert;
  drawers: IAppDrawers;
}

export interface IAppProvider {
  device: IAppProviderDeviceProps;
  alert: IAppProviderAlertProps;
  drawers: IAppProviderDrawerProps;
}

export interface IAppProviderDeviceProps {
  width: number;
  height: number;
  margin: number;
  mobile: boolean;
  isIOS: boolean;
}

export interface IAppProviderAlertProps {
  options: Record<string, any>;
}

export interface IAppAlertProps {
  open: boolean;
  closeOutside: boolean;
  props?: Record<string, any>;
}

export interface IAppAlert {
  closeOutside: boolean;
  options: IAppAlertProps;
  component: any;
}

export const DeviceBackButtonEventName = "deviceBackButton";
export interface IDeviceBackButtonEvent {
  detail: {
    canGoBack?: boolean;
  }
}


/////////////////////////////////////////////////////////////////////
// APP DRAWERS
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export interface IAppDrawers {
  closeOutside: boolean;
  left: IAppDrawerPosition;
  right: IAppDrawerPosition;
  top: IAppDrawerPosition;
  bottom: IAppDrawerPosition;
}

export interface IAppDrawerComponents {
  left?: any;
  right?: any;
  top?: any;
  bottom?: any;
}

export interface IAppDrawerPosition {
  open: boolean;
  closeOutside: boolean;
  props?: Record<string, any>;
  data?: Record<string, any>;
}

export interface IDrawerPosition {
  left: DrawerPositionType | null;
  right: DrawerPositionType | null;
  top: DrawerPositionType | null;
  bottom: DrawerPositionType | null;
}

export interface IAppProviderDrawerProps extends IDrawerPosition {
  closeOutside: boolean;
}

export type DrawerPositionType = { 
  open: boolean, 
  closeOutside: boolean, 
  props: Record<string, any> 
}


/////////////////////////////////////////////////////////////////////
// APP SCREEN MANAGER
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export interface IAppScreenProps {
  class?: string;
  drawerOpen?: boolean;
}

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
  items: BranchItem[];
  branchTo: string | null;
  disclaimer?: string | null;
  data?: any;
}

export interface BranchViewData {
  id?: string;
  parentId?: string;
  component?: any;
  type?: string;
  class?: string;
  dataType?: string;  // json data name
  heading?: string;
  title?: string;
  label?: string;
  content?: string;
  contentClass?: string;
  layout?: string;
  items?: BranchItem[];
  branchTo?: string | null;
  useNav?: boolean;
  useScroll?: boolean;
  showTitle?: boolean;
  showFavorites?: boolean;
  resultLabel?: boolean;
  resultDescription?: string;
  disclaimer?: string;
  showRestart?: boolean;
  isRootParent?: boolean;
  parentView?: BranchViewData;
  checked?: boolean;
  sort?: "ByActive" | "ByAZ" | "ByZA";
  totalCompleted?: number;
  totalChecks?: number;
  lastScrollPos?: number;
  data?: Record<string, any>;
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
  showDebug?: boolean;
}

export type CalculatorParamType = Record<string, any>;

export interface ISearchData {
  category: string;
  id: string;
  title: string;
  keywords: string;
  path: string;
}
