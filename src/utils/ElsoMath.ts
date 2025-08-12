import { CalculatorParamType } from "@/types";

/**
 * ELSOBA_CALC_010_01
 * BSA by Weight and Height
 * 
 * BSA(m2) = √(height(cm) * weight(kg) / 3600)
 * 
 */
export function BSAByWeightAndHeight(params:CalculatorParamType):number {
  const weight = params?.['weight'];
  const height = params?.['height'];
  if (weight === 0) return 0;
  if (height === 0) return 0;

  const group = (height * weight) / 3600;
  return Math.sqrt(group);
}

/**
 * ELSOBA_CALC_010_02
 * BSA by Weight
 * 
 * BSA(m2) = ((weight(kg) * 4) + 7) / (90 + weight(kg))
 * 
 */
export function BSAByWeight(params:CalculatorParamType):number {
  const weight = params?.['weight'];
  if (weight === 0) return 0;

  const group = ((weight * 4) + 7) / (90 + weight);
  return group;  
}

/**
 * ELSOBA_CALC_020_01
 * Convert Feet (ft) to Centimeters (cm)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertFeetToCentimeters(params:CalculatorParamType):number {
  const feet = params?.['feet'];
  if (feet === 0) return 0;

  const group = feet * 12 * 2.54;
  return group;  
}

/**
 * ELSOBA_CALC_020_02
 * Convert Inches (in) to Centimeters (cm)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertInchesToCentimeters(params:CalculatorParamType):number {
  const inches = params?.['inches'];
if (inches === 0) return 0;

  const group = inches * 2.54;
  return group;  
}

/**
 * ELSOBA_CALC_020_03
 * Convert Pounds (lbs) to Kilograms (kg)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertPoundsToKilograms(params:CalculatorParamType):number {
  const pounds = params?.['pounds'];
  if (pounds === 0) return 0;

  const group = pounds / 2.2;
  return group;  
}

/**
 * ELSOBA_CALC_020_04
 * Convert Farenheit to Celcius
 * 
 * °C = 5/9 * (°F - 32)
 * 
 */
export function ConvertFarenheitToCelcius(params:CalculatorParamType):number {
  const farenheit = params?.['farenheit'];
  if (farenheit === 0) return 0;

  const group = (5 / 9) * (farenheit - 32);
  return group;  
}

/**
 * ELSOBA_CALC_020_05
 * Convert French to Millimeters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertFrenchGaugeToMillimeters(params:CalculatorParamType):number {
  const frenchGauge = params?.['frenchGauge'];
  if (frenchGauge === 0) return 0;

  const group = frenchGauge * (1 / 3);
  return group;  
}

/**
 * ELSOBA_CALC_020_06
 * Convert French Gauge to Millimeters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertMillimetersToKilopascals(params:CalculatorParamType):number {
  const millimeters = params?.['millimeters'];
  if (millimeters === 0) return 0;

  const group = millimeters / 7.501;
  return group;  
}

/**
 * ELSOBA_CALC_020_07
 * Convert Milliliters to Liters
 * 
 * 1 Fr = ⅓ mm
 * 
 */
export function ConvertMillilitersToLiters(params:CalculatorParamType):number {
  const milliliters = params?.['milliliters'];
  if (milliliters === 0) return 0;

  const group = milliliters / 1000;
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
export function Convert_mmHg_To_cmH2O(params:CalculatorParamType):number {
  const mmhg_val = params?.['mmhg_val'];
  if (mmhg_val === 0) return 0;
  
  const group = (mmhg_val / 0.73556);
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
export function Convert_cmH2O_To_mmHg(params:CalculatorParamType):number {
  const cmh2o_val = params?.['cmh2o_val'];
  if (cmh2o_val === 0) return 0;

  const group = (cmh2o_val * 0.73556);
  return group;  
}

/**
 * ELSOBA_CALC_030
 * To calculate the appropriate blood flow, mL/kg/min constant.
 * 
 * Flow (cc/min)= mL/kg/min * kg
 * 
 */
export function CalculateBloodFlowByWeight(params:CalculatorParamType):number {
  
  const CC_KG_MIN = params?.['constant'];
  const weight = params?.['weight'];
  if (weight === 0) return 0;
  
  const group = (weight * CC_KG_MIN) / 1000;
  return group;  
}

/**
 * ELSOBA_CALC_040
 * To calculate the appropriate blood flow, cc/kg/min constant.
 * 
 * Flow (cc/min)= cc/kg/min * kg
 * 
 */
export function CalculateOxygenTransferOLD(params:CalculatorParamType):number {
  
  const arterial_saturation = params?.['arterial_saturation'];
  const venous_saturation = params?.['venous_saturation'];
  const hemoglobin = params?.['hemoglobin'];
  const flow = params?.['flow'];

  if (arterial_saturation === 0) return 0;
  if (hemoglobin === 0) return 0;
  if (flow === 0) return 0;
  
  const group = 1.34 * hemoglobin * (arterial_saturation - venous_saturation) * flow / 100;
  return group;  
}
export function CalculateOxygenTransfer(params:CalculatorParamType):number {
  
  const arterial_saturation = params?.['arterial_saturation'];
  const venous_saturation = params?.['venous_saturation'];
  const hemoglobin = params?.['hemoglobin'];
  const flow = params?.['flow'];

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
export function CalculateOxygenDelivery(params:CalculatorParamType):number {
  
  const flow = params?.['flow'];
  const bsa = params?.['bsa'];
  const hemoglobin = params?.['hemoglobin'];
  const sao2 = params?.['sao2'];
  const pao2 = params?.['pao2'];

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
  const DO2i = (CaO2 * flow * 10) / bsa;
  
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
export function CalculateHct(params:CalculatorParamType):number {
  
  const constant = params?.['constant'];
  const total_circuit_volume = params?.['total_circuit_volume'];
  // const membrane_volume = params?.['membrane_volume'];
  // const tubing_volume = params?.['tubing_volume'];
  // const pump_volume = params?.['pump_volume'];
  const patient_weight = params?.['patient_weight'];
  const hematocrit = params?.['hematocrit'];

  if (total_circuit_volume === 0) return 0;
  // if (membrane_volume === 0) return 0;
  // if (tubing_volume === 0) return 0;
  // if (pump_volume === 0) return 0; // depends on
  if (patient_weight === 0) return 0;
  if (hematocrit === 0) return 0;

  // Step 1
  const CIRCUIT_PRIME = total_circuit_volume;

  // Step 2
  const POST_HCT_P1 = patient_weight * constant * hematocrit;
  const POST_HCT_P2 = CIRCUIT_PRIME + (patient_weight * constant);
  const POST_HCT = POST_HCT_P1 / POST_HCT_P2;

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
export function CalculateOI(params:CalculatorParamType):number {
  
  const airway_pressure = params?.['airway_pressure'];
  const fraction = params?.['fraction'];
  const pao2 = params?.['pao2'];

  if (airway_pressure === 0) return 0;
  if (fraction === 0) return 0;
  if (pao2 === 0) return 0;

  // Step 1
  const OI_P1 = airway_pressure * fraction * 100;

  // Step 2
  const OI_P2 = pao2;

  const POST_OI = OI_P1 / OI_P2;

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
export function CalculatePF(params:CalculatorParamType):number {
  
  const airway_pressure = params?.['oxygen_pressure'];
  const fraction = params?.['fraction'];

  if (airway_pressure === 0) return 0;
  if (fraction === 0) return 0;

  const POST_PF = airway_pressure / fraction;

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
export function CalculateRP(params:CalculatorParamType):number {
  
  const pre_oxygen = params?.['pre_oxygen'];
  const venous_oxygen = params?.['venous_oxygen'];
  const post_oxygen = params?.['post_oxygen'];

  if (pre_oxygen === 0) return 0;
  if (venous_oxygen === 0) return 0;
  if (post_oxygen === 0) return 0;

  const RP_P1 = ( pre_oxygen - venous_oxygen );
  const RP_P2 = ( post_oxygen - venous_oxygen );

  const POST_RP = (RP_P1 / RP_P2) * 100;
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
// export function enforceRange(input: HTMLInputElement) {
//   // Parse input value as a float
//   let value = parseFloat(input.value);

//   // Check if the value is out of bounds and clamp if necessary
//   if (value < 0.01) input.value = "0.01";
//   else if (value > 1) input.value = "1";
// }

// export function enforceRangeV2(input: HTMLInputElement): { error: string, min?: number, max?: number } {
//   // Parse input value as a float
//   let value = parseFloat(input.value);
//   if (isNaN(value)) {
//     value = 0;
//   }

//   const min = parseFloat(input.min);
//   const max = parseFloat(input.max);

//   let result = { error: "", min, max }

//   // Check if the value is out of bounds and clamp if necessary
//   if (value <= min) {
//     input.value = min.toString();
//     result.error = `Please enter a number between ${min.toString()} and ${max.toString()}.`;
//   }
//   else if (value >= max) {
//     input.value = max.toString();
//     result.error = `Please enter a number between ${min.toString()} and ${max.toString()}.`;
//   }

//   return result;
// }

export interface IMathEnforeRangeParams {
  value: string;
  min: string, 
  max: string
}
export function enforceRange(input: IMathEnforeRangeParams): { error: string, min?: number, max?: number, value?: string } {
  // Parse input value as a float
  let numberValue = parseFloat(input.value);
  if (isNaN(numberValue)) {
    numberValue = 0;
  }

  const min = parseFloat(input.min);
  const max = parseFloat(input.max);

  let result = { error: "", min, max, value: input.value }

  // Check if the value is out of bounds and clamp if necessary
  if (numberValue < min) {
    result.value = min.toString();
    result.error = `This is outside the range of ${min.toString()} and ${max.toString()}. Please adjust your value(s).`;
  }
  else if (numberValue > max) {
    result.value = max.toString();
    result.error = `This is outside the range of ${min.toString()} and ${max.toString()}. Please adjust your value(s).`;
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
    [/\bSpreO2\b/g, `S<sub class=\"math-sub\">pre</sub>O${sub2wmr}`],
    [/\bSpostO2\b/g, `S<sub class=\"math-sub\">post</sub>O${sub2wmr}`],
    [/\bPpostO2\b/g, `P<sub class=\"math-sub\">post</sub>O${sub2wmr}`],
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
  ];

  // Apply replacements
  for (const [pattern, replacement] of replacements) {
    input = input.replace(pattern, replacement);
  }

  return input;
}
// export function convertMathSymbols(input: string | undefined): string {
//   if (input === undefined) return "";
  
//   const sup2 = `<sup class='math-sup'>2</sup>`
//   const sub2 = `<sub class='math-sub'>2</sub>`
//   const sub2wmr = `<sub class='math-sub mr-pad'>2</sub>`

//   return input
//     .replace(/\bsqrt\(/g, `√(`)
//     .replace(/\^2\b/g, `²`)
//     .replace(/\^3\b/g, `³`)
//     .replace(/\bpi\b/gi, `π`)
//     .replace(/\btheta\b/gi, `θ`)
//     .replace(/\balpha\b/gi, `α`)
//     .replace(/\bbeta\b/gi, `β`)
//     .replace(/\bH2O\b/g, `H${sub2}O`)
//     .replace(/\bO2\b/g, `O${sub2wmr}`)
//     .replace(/\bCO2\b/g, `CO${sub2wmr}`)
//     .replace(/\bCaO2\b/g, `CaO${sub2wmr}`)
//     .replace(/\bDO2\b/g, `DO${sub2wmr}`)
//     .replace(/\bDO2i\b/g, `DO${sub2}i`)
//     .replace(/\bVO2\b/g, `VO${sub2wmr}`)
//     .replace(/\bFDO2\b/g, `FDO${sub2wmr}`)
//     .replace(/\bSvO2\b/g, `SvO${sub2wmr}`)
//     .replace(/\bSaO2\b/g, `SaO${sub2wmr}`)
//     .replace(/\bSpO2\b/g, `SpO${sub2wmr}`)
//     .replace(/\bSpreO2\b/g, `S<sub class='math-sub'>pre</sub>O${sub2wmr}`)
//     .replace(/\bSpostO2\b/g, `S<sub class='math-sub'>post</sub>O${sub2wmr}`)
//     .replace(/\bFsO2\b/g, `FsO${sub2wmr}`)
//     .replace(/\bFiO2\b/g, `FiO${sub2wmr}`)
//     .replace(/\bPAW\b/g, `P<sub class='math-sub pad'>AW</sub>`)
//     .replace(/\bParO2\b/g, `ParO${sub2wmr}`)
//     .replace(/\bPaO2\b/g, `PaO${sub2wmr}`)
//     .replace(/\bPaCO2\b/g, `PaCO${sub2wmr}`)
//     .replace(/\bPO2\b/g, `PO${sub2wmr}`)
//     .replace(/\bPCO2\b/g, `PCO${sub2wmr}`)
//     .replace(/\bpCO2\b/g, `PCO${sub2wmr}`)
//     .replace(/\bmmH2O\b/g, `mmH${sub2}O`)
//     .replace(/\bmm3\b/g, `mm³`)
//     .replace(/\bmL\/min\/m2\b/g, `mL/min/m${sup2}`)
//     .replace(/\bm2\b/g, `m${sup2}`)
//     .replace(/\bVMLO2\b/g, `VMLO${sub2wmr}`)
//     .replace(/\bVMLCO2\b/g, `VMLCO${sub2wmr}`);
// }