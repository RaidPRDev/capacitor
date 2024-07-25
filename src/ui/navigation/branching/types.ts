import { IBaseButtonProps } from "@/ui/types";

export interface BranchItem {
  label: string;
  branchTo: string | null;
}

export interface BranchViewData {
  id: string;
  component: any;
  title: string;
  content?: string;
  layout: string;
  items: BranchItem[];
  branchTo: string | null;
  useNav?: boolean;
  useScroll?: boolean;
}

export interface IBranchNavButtonProps {
  disabled: boolean;
  buttonProps?: IBaseButtonProps;
  label?: string;
  icon?: any;
  data?: Record<string, any>;
}