import { CalculatorParamType } from "@/types";
import { isObjectEmpty } from "./ObjectTools";


export interface ICalculationError {
  value?: any;
  error?: { 
    message: string;
    field: string;
  } 
}

export type CalculationResult = number | ICalculationError;
export type CalculationArgsData = Array<any> | null;


/**
 * ELSOBA_CALC_010_01
 * BSA by Weight and Height
 * 
 * BSA(m2) = √(height(cm) * weight(kg) / 3600)
 * 
 */
export function BSAByWeightAndHeight(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  // console.warn("BSAByWeightAndHeight", params, data);

  const weight = params?.['weight'];
  const height = params?.['height'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (weight === 0) return 0;
  if (height === 0) return 0;

  const group = (height * weight) / 3600;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return Math.sqrt(group);
}

/**
 * ELSOBA_CALC_010_02
 * BSA by Weight
 * 
 * BSA(m2) = ((weight(kg) * 4) + 7) / (90 + weight(kg))
 * 
 */
export function BSAByWeight(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const weight = params?.['weight'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (weight === 0) return 0;

  const group = ((weight * 4) + 7) / (90 + weight);

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_01
 * Convert Feet (ft) to Centimeters (cm)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertFeetToCentimeters(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const feet = params?.['feet'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (feet === 0) return 0;

  const group = feet * 12 * 2.54;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_02
 * Convert Inches (in) to Centimeters (cm)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertInchesToCentimeters(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const inches = params?.['inches'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (inches === 0) return 0;

  const group = inches * 2.54;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_03
 * Convert Pounds (lbs) to Kilograms (kg)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertPoundsToKilograms(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const pounds = params?.['pounds'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (pounds === 0) return 0;

  const group = pounds / 2.2;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_04
 * Convert Farenheit to Celcius
 * 
 * °C = 5/9 * (°F - 32)
 * 
 */
export function ConvertFarenheitToCelcius(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const farenheit = params?.['farenheit'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (farenheit === 0) return 0;

  const group = (5 / 9) * (farenheit - 32);

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_05
 * Convert French to Millimeters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertFrenchGaugeToMillimeters(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const frenchGauge = params?.['frenchGauge'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (frenchGauge === 0) return 0;

  const group = frenchGauge * (1 / 3);

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_06
 * Convert French Gauge to Millimeters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertMillimetersToKilopascals(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const millimeters = params?.['millimeters'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (millimeters === 0) return 0;

  const group = millimeters / 7.501;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }
  
  return group;  
}

/**
 * ELSOBA_CALC_020_07
 * Convert Milliliters to Liters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertMillilitersToLiters(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const milliliters = params?.['milliliters'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (milliliters === 0) return 0;

  const group = milliliters / 1000;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_08
 * Convert mmHg to cmH2O
 * 
 * 1 mmHg = 1.36 cmH2O
 * 1 cmH2O = 0.735 mmHg
 * 
 */
export function Convert_mmHg_To_cmH2O(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  const mmhg_val = params?.['mmhg_val'];
  
  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }
  
  if (mmhg_val === 0) return 0;
  
  const group = (mmhg_val / 0.73556);

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_020_09
 * Convert cmH2O to mmHg
 * 
 * 1 mmHg = 1.36 cmH2O
 * 1 cmH2O = 0.735 mmHg
 * 
 */
export function Convert_cmH2O_To_mmHg(params:CalculatorParamType, data: CalculationArgsData = null):CalculationResult {
  const cmh2o_val = params?.['cmh2o_val'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (cmh2o_val === 0) return 0;

  const group = (cmh2o_val * 0.73556);

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_030
 * To calculate the appropriate blood flow, mL/kg/min constant.
 * 
 * Flow (cc/min)= mL/kg/min * kg
 * 
 */
export function CalculateBloodFlowByWeight(params:CalculatorParamType, data: CalculationArgsData = null):CalculationResult {
  
  const CC_KG_MIN = params?.['constant'];
  const weight = params?.['weight'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (weight === 0) return 0;
  
  const group = (weight * CC_KG_MIN) / 1000;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_040
 * To calculate the appropriate blood flow, cc/kg/min constant.
 * 
 * Flow (cc/min)= cc/kg/min * kg
 * 
 */
export function CalculateOxygenTransferOLD(params:CalculatorParamType, data: CalculationArgsData = null):CalculationResult {
  
  const arterial_saturation = params?.['arterial_saturation'];
  const venous_saturation = params?.['venous_saturation'];
  const hemoglobin = params?.['hemoglobin'];
  const flow = params?.['flow'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (arterial_saturation === 0) return 0;
  if (hemoglobin === 0) return 0;
  if (flow === 0) return 0;
  
  const group = 1.34 * hemoglobin * (arterial_saturation - venous_saturation) * flow / 100;
  
  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

export function CalculateOxygenTransfer(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  
  const arterial_saturation = params?.['arterial_saturation'];
  const venous_saturation = params?.['venous_saturation'];
  const hemoglobin = params?.['hemoglobin'];
  const flow = params?.['flow'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // // console.error("Validation Error", params);
    return test;
  }

  if (arterial_saturation === 0) return 0;
  if (hemoglobin === 0) return 0;
  if (flow === 0) return 0;
  
  // Q*[0.134*Hb*(Post Sat- Pre Sat) + 0.031*(Post pO2-Pre pO2)] to end up with mL O2/min.
  /*
    The oxygen carrying capacity is 1.34 mLO2/g Hb
    Hb is reported in g/dL
    Q is L/min
    Sat is whole number %
    The solubility of O2 in water is 0.0031 mLO2/dL/mmHg

    Blood Flow (Q) 0-10000
    Hb 0 - 25  - Ex 10 
    Art Sat - 100
    Ven Sat - 70
    Flow - 5000
  */

  const group = 1.34 * hemoglobin * ( (arterial_saturation - venous_saturation) / 100 ) * flow / 100;

  if (!isObjectEmpty(isResultOutOfRange(group))) {
    return isResultOutOfRange(group);
  }

  return group;  
}

/**
 * ELSOBA_CALC_050
 * Determine the cardiac index, then the oxygen carrying capacity, 
 * and finally the oxygen delivery (DO2i)
 * 
 * CI = Flow/BSA
 * CaO2 = (Hb * 1.34)(SaO2 / 100) + (0.003 * PaO2) 
 * DO2i = CaO2 * CI * 10
 */
export function CalculateOxygenDelivery(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  
  const flow = params?.['flow'];
  const bsa = params?.['bsa'];
  const hemoglobin = params?.['hemoglobin'];
  const sao2 = params?.['sao2'];
  const pao2 = params?.['pao2'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (flow === 0) return 0;
  if (bsa === 0) return 0;
  if (hemoglobin === 0) return 0;
  if (sao2 === 0) return 0;
  if (pao2 === 0) return 0;

  /*
    DO2i (mL/min/m2) = 10 * pump flow index(L/min/m2) * [(hemoglobin (g/dL) * SaO2 (%) * 1.36) + (PaO2 (mmHg) * 0.003)]
  */

  // Step 1
  // const CI = flow / bsa;

  // Step 2 (Hb * 1.34)(SaO2 / 100) + (0.003 * PaO2) 
  const CaO2 = (hemoglobin * 1.34 * (sao2 / 100)) + (0.003 * pao2);

  // Step 3 CaO2 * CI * 10
  const DO2i = (CaO2 * (flow / 1000) * 10) / bsa;
  
  if (!isObjectEmpty(isResultOutOfRange(DO2i))) {
    return isResultOutOfRange(DO2i);
  }

  return DO2i;  
}

/**
 * ELSOBA_CALC_060
 * Identify how much blood you need for the patient to notify the blood bank. 
 * 
 * Circuit Prime (mL)** = membrane lung volume (cc) + tubing volume (cc) + ( pump volume (if centrifugal) (cc))
 * 
 * Total Circuit Volume (cc) 
 *    Membrane lung volume (cc) 
 *    Tubing volume (cc) 
 *    *Pump volume (cc)
 * 
 * Patient weight (kg) * constant * Hct / Circuit Prime + (patient weight (kg) * constant) = X%
 * 
 */
export function CalculateHct(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  
  const constant = params?.['constant'];
  const total_circuit_volume = params?.['total_circuit_volume'];
  const patient_weight = params?.['patient_weight'];
  const hematocrit = params?.['hematocrit'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (total_circuit_volume === 0) return 0;
  if (patient_weight === 0) return 0;
  if (hematocrit === 0) return 0;

  // Step 1
  const CIRCUIT_PRIME = total_circuit_volume;

  // Step 2
  const POST_HCT_P1 = patient_weight * constant * hematocrit;
  const POST_HCT_P2 = CIRCUIT_PRIME + (patient_weight * constant);
  const POST_HCT = POST_HCT_P1 / POST_HCT_P2;

  if (!isObjectEmpty(isResultOutOfRange(POST_HCT))) {
    return isResultOutOfRange(POST_HCT);
  }

  return POST_HCT;  
}

/**
 * ELSOBA_CALC_070
 * Oxygenation Index (OI)
 * 
 * PAW(mmHg) = Mean airway pressure
 * FiO2(%) = fraction of inspired oxygen as a percentage
 * PaO2 = 
 * 
 */
export function CalculateOI(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  // console.log("CalculateOI.params", params)
  // console.log("CalculateOI.data", data)

  const airway_pressure = params?.['airway_pressure'];
  const fraction = params?.['fraction'];
  const pao2 = params?.['pao2'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (airway_pressure === 0) return 0;
  if (fraction === 0) return 0;
  if (pao2 === 0) return 0;

  // Step 1
  const OI_P1 = airway_pressure * fraction;

  // Step 2
  const OI_P2 = pao2;

  const POST_OI = OI_P1 / OI_P2;

  if (!isObjectEmpty(isResultOutOfRange(POST_OI))) {
    return isResultOutOfRange(POST_OI);
  }

  return POST_OI;  
}

/**
 * ELSOBA_CALC_080
 * CalculatePF
 * 
 * PaO2 (mmHg) = arterial partial pressure of oxygen
 * FiO2(%) = fraction of inspired oxygen, as a decimal
 * 
 */
export function CalculatePF(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  // console.log("CalculatePF.params", params)
  // console.log("CalculatePF.data", data)

  const airway_pressure = params?.['oxygen_pressure'];
  const fraction = params?.['fraction'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (airway_pressure === 0) return 0;
  if (fraction === 0) return 0;

  const POST_PF = airway_pressure / fraction;

  if (!isObjectEmpty(isResultOutOfRange(POST_PF))) {
    return isResultOutOfRange(POST_PF);
  }

  return POST_PF;  
}

/**
 * ELSOBA_CALC_090
 * CalculateRP
 * 
 * SpreO2 — pre-oxygenator oxygen saturation
 * SvO2 — venous oxygen saturation
 * SpostO2 — post-oxygenator oxygen saturation
 * 
 */
export function CalculateRP(params:CalculatorParamType, data:CalculationArgsData = null):CalculationResult {
  
  const pre_oxygen = params?.['pre_oxygen'];
  const venous_oxygen = params?.['venous_oxygen'];
  const post_oxygen = params?.['post_oxygen'];

  const test = validateInputParams(params, data);
  if (isNaN(test as number)) {
    // console.error("Validation Error", params);
    return test;
  }

  if (pre_oxygen === 0) return 0;
  if (venous_oxygen === 0) return 0;
  if (post_oxygen === 0) return 0;

  const RP_P1 = ( pre_oxygen - venous_oxygen );
  const RP_P2 = ( post_oxygen - venous_oxygen );

  const POST_RP = (RP_P1 / RP_P2) * 100;
  
  if (!isObjectEmpty(isResultOutOfRange(POST_RP))) {
    return isResultOutOfRange(POST_RP);
  }

  return POST_RP;
}

/**
 * ELSOBA_CALC_100__01
 * Calculate_1_4_Tubing
 * 
 * ¼” Tubing Volume
 * 
 * 10 cc = 1 foot of ¼” tubing
 * 
 */
export function Calculate_1_4_Tubing(params:CalculatorParamType):number {
  
  const foot = params?.['foot'];

  if (foot === 0) return 0;

  const POST_TUBING = foot * 10;
  return POST_TUBING;
}

/**
 * ELSOBA_CALC_100__02
 * Calculate_3_8_Tubing
 * 
 * ⅜” Tubing Volume
 * 
 * 20 cc = 1 foot of ⅜” tubing
 * 
 */
export function Calculate_3_8_Tubing(params:CalculatorParamType):number {
  
  const foot = params?.['foot'];

  if (foot === 0) return 0;

  const POST_TUBING = foot * 20;
  return POST_TUBING;
}

/**
 * ELSOBA_CALC_100__03
 * Calculate_3_8_Tubing
 * 
 * ½” Tubing Volume
 * 
 * 20 cc = 1 foot of ½” tubing
 * 
 */
export function Calculate_1_2_Tubing(params:CalculatorParamType):number {
  
  const foot = params?.['foot'];

  if (foot === 0) return 0;

  const POST_TUBING = foot * 40;
  return POST_TUBING;
}



/**
 * INPUT Utils
 * 
 */

function validateInputParams(params: any, data: any) {
  // console.log("validateInputParams", params, data);  
  
  for (let key in params) {
    const validationResult = validateInputs(key, params[key], data);
    if (validationResult?.hasOwnProperty("error")) {
      return validationResult;
    }
  }

  return 0;
}

export interface IMathEnforeRangeParams {
  id?: string;
  value: string;
  min: string; 
  max: string;
}

export function enforceRange(input: IMathEnforeRangeParams): { error: string, min?: number, max?: number, value?: string } {
  // console.log("enforceRange", input)
  
  // Parse input value as a float
  let numberValue = parseFloat(input.value);
  if (isNaN(numberValue)) {
    numberValue = 0;
  }

  const min = parseFloat(input.min);
  const max = parseFloat(input.max);

  let result = { error: "", min, max, value: input.value }

  if (input.value.length === 0) {
    // console.log("EMPTY INPUT", input.value);
    result.error = `[${input.id}] This is outside the range of ${min.toString()} and ${max.toString()}. Please adjust your value(s).`;
    return result;
  }

  // Check if the value is out of bounds and clamp if necessary
  if (numberValue < min) {
    // result.value = min.toString();
    result.error = `[${input.id}] This is outside the range of ${min.toString()} and ${max.toString()}. Please adjust your value(s).`;
  }
  else if (numberValue > max) {
    // result.value = max.toString();
    result.error = `[${input.id}] This is outside the range of ${min.toString()} and ${max.toString()}. Please adjust your value(s).`;
  }

  return result;
}

/**
 * Converts common mathematical notation written in plain text
 * into their corresponding Unicode symbols for cleaner and more readable output.
 * 
 * Supported conversions:
 * - "sqrt"     → "√"
 * - "^2"       → "²"
 * - "^3"       → "³"
 * - "pi"       → "π"
 * - "theta"    → "θ"
 * - "alpha"    → "α"
 * - "beta"     → "β"
 * - "H2O"      → "H₂O"
 * - "O2"       → "O₂"
 * - "CO2"      → "CO₂"
 * - "CaO2"     → "CaO₂"
 * - "DO2"      → "DO₂"
 * - "DO2i"     → "DO2i₂"
 * - "VO2"      → "VO₂"
 * - "FDO2"     → "FDO₂"
 * - "SvO2"     → "SvO₂"
 * - "SaO2"     → "SaO₂"
 * - "SpO2"     → "SpO₂"
 * - "SpreO2"   → "S<sub class='math-sub'>pre</sub>O₂"
 * - "SpostO2"  → "S<sub class='math-sub'>post</sub>O₂"
 * - "FsO2"     → "FsO₂"
 * - "FiO2"     → "FiO₂"
 * - "PAW"      → "P<sub class='math-sub'>AW</sub>"
 * - "ParO2"    → "ParO₂"
 * - "PaO2"     → "PaO₂"
 * - "PaCO2"    → "PaCO₂"
 * - "PO2"      → "PO₂"
 * - "PCO2"     → "PCO₂"
 * - "pCO2"     → "PCO₂"
 * - "mmH2O"    → "mmH₂O"
 * - "mm3"      → "mm³"
 * - "VMLO2"    → "VMLO₂"
 * - "VMLCO2"   → "VMLCO₂"
 * 
 * @param input - A string that may contain plain-text mathematical expressions.
 * @returns A new string with appropriate math symbols substituted in.
 */
export function convertMathSymbols(input: string | undefined): string {
  if (!input) return "";

  const sup2 = `<sup class=\"math-sup\">2</sup>`;
  const sub2 = `<sub class=\"math-sub\">2</sub>`;
  const sub2wmr = `<sub class=\"math-sub mr-pad\">2</sub>`;

  // Define pattern-replacement pairs
  const replacements: [RegExp, string][] = [
    [/\bsqrt\(/g, `√(`],
    [/\^2\b/g, `²`],
    [/\^3\b/g, `³`],
    [/\^(\d+)/g, `<sup>$1</sup>`], // generic superscript for ^n
    [/\bpi\b/gi, `π`],
    [/\btheta\b/gi, `θ`],
    [/\balpha\b/gi, `α`],
    [/\bbeta\b/gi, `β`],
    [/\bcmH2O\b/g, `cmH${sub2}O`],
    [/\bH2O\b/g, `H${sub2}O`],
    [/\bH2O3\b/g, `H${sub2}O<sup class='math-sup'>3</sup>`],
    [/\bO2\b/g, `O${sub2wmr}`],
    [/\bCO2\b/g, `CO${sub2wmr}`],
    [/\bCaO2\b/g, `CaO${sub2wmr}`],
    [/\bDO2i\b/g, `DO${sub2}i`],
    [/\bDO2\b/g, `DO${sub2wmr}`],
    [/\bVO2\b/g, `VO${sub2wmr}`],
    [/\bFDO2\b/g, `FDO${sub2wmr}`],
    [/\bSvO2\b/g, `SvO${sub2wmr}`],
    [/\bSaO2\b/g, `SaO${sub2wmr}`],
    [/\bSpO2\b/g, `SpO${sub2wmr}`],
    [/\bPPRE-ML\b/g, `P<sub class=\"math-sub\">PRE-ML</sub><HtmlSpacer></HtmlSpacer>`],
    [/\bPPOST-ML\b/g, `P<sub class=\"math-sub\">POST-ML</sub><HtmlSpacer></HtmlSpacer>`],
    [/\bSpreO2\b/g, `S<sub class=\"math-sub\">pre</sub>O${sub2wmr}`],
    [/\bSpostO2\b/g, `S<sub class=\"math-sub\">post</sub>O${sub2wmr}`],
    [/\bPpostO2\b/g, `P<sub class=\"math-sub\">post</sub>O${sub2wmr}`],
    [/\bHctpre\b/g, `Hct<sub class=\"math-sub\">PRE</sub>`],
    [/\bHctpost\b/g, `Hct<sub class=\"math-sub\">POST</sub>`],
    [/\bFsO2\b/g, `FsO${sub2wmr}`],
    [/\bFiO2\b/g, `FiO${sub2wmr}`],
    [/\bPAW\b/g, `P<sub class=\"math-sub pad\">AW</sub>`],
    [/\bParO2\b/g, `ParO${sub2wmr}`],
    [/\bPaO2\b/g, `PaO${sub2wmr}`],
    [/\bPaCO2\b/g, `PaCO${sub2wmr}`],
    [/\bPO2\b/g, `PO${sub2wmr}`],
    [/\bPCO2\b/g, `PCO${sub2wmr}`],
    [/\bpCO2\b/g, `PCO${sub2wmr}`],
    [/\bmmH2O\b/g, `mmH${sub2}O`],
    [/\bmm3\b/g, `mm³`],
    [/\bmL\/min\/m2\b/g, `mL/min/m${sup2}`],
    [/\bm2\b/g, `m${sup2}`],
    [/\bVMLO2\b/g, `VMLO${sub2wmr}`],
    [/\bVMLCO2\b/g, `VMLCO${sub2wmr}`],
    [/\bEtCO2\b/g, `EtCO${sub2}`],
    [/\bPINLET\b/g, `P<sub class=\"math-sub\">INLET</sub>`],
  ];

  // Apply replacements
  for (const [pattern, replacement] of replacements) {
    input = input.replace(pattern, replacement);
  }

  return input;
}

export function validateInputs(id: string, value: number, data:any): CalculationResult {
  const _log = false;
  
  if (_log) console.log(`validateInputs[${id}]`, value);

  let searchID: string = "", searchParam: any = null, searchIndex: number = -1;
  if (_log) console.log(`data`, data);

  if (data && Array.isArray(data)) {
    searchID = id;
    searchIndex = data.findIndex((item) => item.id === searchID);
    if (_log) console.log(`searchIndex`, searchIndex);

    if (searchIndex > -1) {
      searchParam = data[searchIndex];
      if (_log) console.log(`searchParam[${searchID}]`, searchParam);
    }
    
    if (searchParam) {
      if (searchParam?.inputProps) {
        const _min = parseFloat(searchParam.inputProps?.['min']) ?? -1;
        const _max = parseFloat(searchParam.inputProps?.['max']) ?? -1;

        if (isNaN(value) || value === 0) {
          // return value if min is zero
          if (_min === 0 && value === 0) {
            return value;
          }
          
          return {
            value: value ?? "",
            error: {
              message: `[${id}] is outside the range of ${_min} and ${_max}. Please adjust your value(s).`,
              field: searchID
            }
          };
        }

        if (value < _min) {
          if (_log) console.error(`[${searchID}] is outside the range of ${_min} and ${_max}. Please adjust your value(s). `);
          return {
            value: value,
            error: {
              message: `[${searchID}] is outside the range of ${_min} and ${_max}. Please adjust your value(s).`,
              field: searchID
            }
          };
        }
        else if (value > _max) {
          if (_log) console.error(`[${searchID}] is outside the range of ${_min} and ${_max}. Please adjust your value(s). `);
          return {
            value: value,
            error: {
              message: `[${searchID}] is outside the range of ${_min} and ${_max}. Please adjust your value(s).`,
              field: searchID
            }
          };
        }
      }
    }
  }

  return value;
}

export function isResultOutOfRange(value: any): CalculationResult {
  // confirm result value is not out of range
  if (value === Infinity || value === -Infinity) {
    return {
      error: { message: `Result is out of range [${value}]`, field: "" },
      value: 0
    };
  }

  return {};
}