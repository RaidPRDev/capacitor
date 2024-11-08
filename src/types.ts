export type DrawerPositionType = { 
  open: boolean, 
  closeOutside: boolean, 
  props: Record<string, any> 
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

export interface IDrawerPosition {
  left: DrawerPositionType | null;
  right: DrawerPositionType | null;
  top: DrawerPositionType | null;
  bottom: DrawerPositionType | null;
}

export interface IAppProviderDrawerProps extends IDrawerPosition {
  closeOutside: boolean;
}

export interface IAppProvider {
  device: IAppProviderDeviceProps;
  alert: IAppProviderAlertProps;
  drawers: IAppProviderDrawerProps;
}