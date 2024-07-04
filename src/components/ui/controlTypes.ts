
export interface IBaseControl {
  disabled?: boolean;
}

export interface IBaseButtonProps extends IBaseControl {
  label?: string;
  subLabel?: string;
  icon?: string | object;
  accessoryIcon?: string | object;
  gap?: string;
  innerClassName?: string;
}