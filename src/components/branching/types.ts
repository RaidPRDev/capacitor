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

