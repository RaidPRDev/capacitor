import { HTMLAttributes } from "vue";
import { IErrorFieldProps } from "./utils/InputValidation";

// GENERAL ////////////////////////////////////////////////////////////////////

/** @ts-ignore ts(6196) */
type NotUndefined<T> = T extends undefined ? never : T

export type NativeType = null | number | string | boolean | symbol

type InferDefault<P, T> =

    ((props: P) => T & {}) | (T extends NativeType ? T : never) | (T extends (...args: any[]) => any ? T : never)

export type InferDefaults<T> = {
    [K in keyof T]?: InferDefault<T, T[K]>
}

export type ComplextPropType = boolean | string | any[] | null;
////////////////////////////////////////////////////////////////////////

export interface IBaseControl {
  disabled?: boolean;
}

export interface IBaseButtonProps extends IBaseControl {
  label?: string;
  subLabel?: string;
  icon?: string | object;
  accessoryIcon?: string | object;
  gap?: string;
  iconProps?: Record<string, any>;
  accessoryIconProps?: Record<string, any>;
  elementClassName?: string;
  centerClassName?: string;
  innerClassName?: string;
  iconClassName?: string;
  useIconAsRaw?: boolean;
  useAccessoryIconAsRaw?: boolean;
  accessoryIconClassName?: string;
  labelClassName?: string;
  subLabelClassName?: string;
  bodyClassName?: string;
  pressedTranstionDelay?: number;
  usePressedState?: boolean;
  useLongPressedState?: boolean;
  longPressedDelay?: number;
  asSubControl?: boolean;
  hasInternalLinks?: boolean;
  triggerCallback?: (data?: any) => void;
}

export interface IBaseToggleProps {
  modelValue?: boolean | null;
  label?: string;
  elementClass?: string | string[];
  defaultIcon?: any;
  activeIcon?: any;
  asSubControl?: boolean;
  triggerCallback?: (toggled?:boolean) => void;
}

export type IBaseHeaderItemType = {
  gap?: number;
  className?: string;
}

export interface IBaseHeaderProps extends IBaseControl {
  innerClassName?: string;
  centerClassName?: string;
  leftProps?: IBaseHeaderItemType;
  centerProps?: IBaseHeaderItemType;
  rightProps?: IBaseHeaderItemType;
}

export interface IBaseScreenProps extends IBaseControl {
  className?: string;
  innerClassName?: string;
  headerSlotProps?: IBaseScreenSlotProps;
  bodySlotProps?: IBaseScreenSlotProps;
  footerSlotProps?: IBaseScreenSlotProps;
  drawerSlotProps?: IBaseScreenSlotProps;
}

export interface IBaseScreenSlotProps {
  class?: string;
  height?: number;
  styles?: Record<string, any>;
}

export interface IBasePanelProps {
  class?: string;
  innerClass?: string;
  height?: number;
  styles?: Record<string, any>;
  headerSlotProps?: IBasePanelSlotProps;
}

export interface IBasePanelSlotProps {
  class?: string;
  height?: number;
  styles?: Record<string, any>;
}


export interface IBaseInputProps extends IBaseControl {
  modelValue?: string;
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  containerClass?: (string | undefined ) | (string | undefined)[];
  innerClass?: (string | undefined ) | (string | undefined)[];
  inputFieldClass?: (string | undefined ) | (string | undefined)[];
  elementClass?: (string | undefined ) | (string | undefined)[];
  label?: string;
  labelClass?: string;
  icon?: string | object;
  accessoryIcon?: string | object;
  gap?: string;
  required?: boolean;
  autocomplete?: string;
  pattern?: string;
  error?: IErrorFieldProps;
}

export interface IButtonGroupProps extends IBaseControl { 
  dataProvider: Array<IBaseButtonProps>;
  selectedIndex?: number;
  elementClassName?: string;
  innerClassName?: string;
  buttonClassName?: string;
  defaultButtonProps?: IBaseButtonProps,  
  buttonComponent?: object;
}

export type IButtonGroupSelected = {
  index: number;
  data: Record<string, any>
}

export interface IBaseListItemData {
  type?: string;
  groupType?: BaseListGroupType;
  label?: string;
  class?: string;
  icon?: any;
  iconProps?: any;
  accessoryIcon?: any;
  accessoryIconProps?: any;
  data?: Record<string, any>;
}

export interface IBaseTransitionProps {
  name: string;
  tag: string;
  transitionDelay: number;
}

export type BaseListGroupType = "GroupHeader" | "GroupItem"

export interface IBaseListProps {
  dataProvider?: Array<IBaseListItemData> | null;
  class?: string; 
  listItemClass?: string; 
  listItemStyles?: Record<string, any>; 
  buttonProps?: IBaseButtonProps;
  
  transitionEnabled?: boolean,
  transitionAppear?: boolean,
  transitionDelayedStart?: number;
  transitionProps?: IBaseTransitionProps;
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

export interface IAppDrawerPosition {
  open: boolean;
  closeOutside: boolean;
  props?: Record<string, any>;
}

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

export interface IAppScreenProps {
  class?: string;
  drawerOpen?: boolean;
}

export interface IApp {
  device: {
    width: number;
    height: number;
    margin: number;
    mobile: boolean;
    isIOS: boolean;
  };
  alert: IAppAlert;
  drawers: IAppDrawers;
}

export interface IBaseTextAreaProps {
  modelValue?: string
  id?: string
  name?: string
  containerClass?: (string | undefined ) | (string | undefined)[]
  fieldClass?: (string | undefined ) | (string | undefined)[]
  elementClass?: (string | undefined ) | (string | undefined)[]
  placeholder?: string
  label?: string
  labelClass?: string
  icon?: string | object
  accessoryIcon?: string | object
  gap?: string
  rows?: number;
  cols?: number;
  spellCheck?: "true" | "false" | "default";
  wrap?: "hard" | "soft" | "off";
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  autocomplete?: string;
}

/**
 * HtmlParser component
 */
export interface IHtmlParserElementItem {
  tag: string;                                        // The HTML tag name (e.g., 'div', 'p', '#text' for text nodes)
  children: IHtmlParserElementItem[];                 // Array of child IElementItem elements
  dataParams: { [key: string]: string | object };     // Object with all attributes, possibly parsed JSON
  textContent?: string;                               // The content of text nodes, if applicable
}

export type IHtmlParserDataProps = HTMLAttributes & { 
  wrapperClass?: string, 
  dataId?: string, 
  ['data-id']?: string 
}
