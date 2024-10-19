export interface IAppToaster {
  enabled: boolean;
}

export interface IToaster { 
  index?:number;
  id?: number;
  label?: string;
  duration?: number;
  hasAutoClose?: boolean;
  component?: any;
  componentProps?: any;
  position?: string;
}

export interface IToasterServiceState {
  toasts?: Array<IToaster>,
  positions?: Array<number>,
}
