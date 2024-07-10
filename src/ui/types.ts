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
  elementClassName?: string;
  innerClassName?: string;
  iconClassName?: string;
  accessoryIconClassName?: string;
  bodyClassName?: string;
}

export type IBaseHeaderItemType = {
  gap?: number;
}

export interface IBaseHeaderProps extends IBaseControl {
  innerClassName?: string;
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
}

export interface IBaseScreenSlotProps {
  class?: string;
  styles?: Record<string, any>;
}

export interface IBaseInputProps extends IBaseControl {
  modelValue?: string;
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  containerClass?: (string | undefined ) | (string | undefined)[];
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