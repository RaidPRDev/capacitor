/**
 * Global
 */

export const APP_ID = "__APP__";
export const APP_BODY_ID = "__APP_BODY__";
export const APP_NAV_ID = "__APP_NAV__";
export const APP_DRAWERS_ID = "__APP_DRAWERS__";
export const APP_ALERT_ID = "__APP_ALERT__";
export const APP_TOASTER_ID = "__APP_TOASTER__";

export const COMPILED_DATA_PATH = "app/compiled";

export const GLOBAL_PADDING = 20;
export const APP_HEADER_HEIGHT = 99;
export const TOP_HEADER_NAV_HEIGHT = 60;
export const BOTTOM_HEADER_NAV_HEIGHT = (padding: number = 0) => {
  return 77 + padding;
};
export const BREADCRUMB_HEIGHT = 56;
export const SCREEN_BODY_TOP_PADDING = 40;
export const SCREEN_BODY_BOTTOM_PADDING = 20;

// BRANCH
export const BRANCH_HEADER_HEIGHT = 48;
export const BRANCH_FOOTER_HEIGHT = 76;
export const BRANCH_BOTTOM_NAV_HEIGHT = 60;

// JSON DATA TYPES
export const JSON_DATA_TYPE_MEDICATIONS = "medications";
export const JSON_DATA_TYPE_EQUIPMENT = "equipment";
export const JSON_DATA_TYPE_PANIC = "panic";
export const JSON_DATA_TYPE_CALCULATORS = "calculators";
export const JSON_DATA_TYPE_CHECKLISTS = "checklists";
export const JSON_DATA_TYPE_CHECKLIST_ITEM = "item";
