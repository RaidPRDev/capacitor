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
 * Convert French Gauge to Millimeters
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
export function ConvertMillimetersToLiters(params:CalculatorParamType):number {
  const millimeters = params?.['millimeters'];
  if (millimeters === 0) return 0;

  const group = millimeters / 1000;
  return group;  
}

/**
 * ELSOBA_CALC_030
 * To calculate the appropriate blood flow, cc/kg/min constant.
 * 
 * Flow (cc/min)= cc/kg/min * kg
 * 
 */
export function CalculateBloodFlowByWeight(params:CalculatorParamType):number {
  
  const CC_KG_MIN = params?.['constant'];
  const weight = params?.['weight'];
  if (weight === 0) return 0;
  
  const group = weight * CC_KG_MIN;
  return group;  
}

/**
 * ELSOBA_CALC_040
 * To calculate the appropriate blood flow, cc/kg/min constant.
 * 
 * Flow (cc/min)= cc/kg/min * kg
 * 
 */
export function CalculateOxygenTransfer(params:CalculatorParamType):number {
  
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

/**
 * ELSOBA_CALC_050
 * Determine the cardiac index, then the oxygen carrying capacity, 
 * and finally the oxygen delivery (DO2i)
 * 
 * CI = Flow/BSA  1.5
 * CaO2 = (Hb * 1.34)(SaO2) + (0.003 * PaO2)  0.1735
 * DO2i = 10 x CI x CaO2
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

  // Step 2
  const CaO2 = (hemoglobin * 1.34 * sao2) + (0.003 * pao2);

  // Step 3
  const DO2i = (CaO2 * flow * 10) / bsa;
  
  return DO2i;  
}

/**
 * ELSOBA_CALC_060
 * Determine the cardiac index, then the oxygen carrying capacity, 
 * and finally the oxygen delivery (DO2i)
 * 
 * CI = Flow/BSA  1.5
 * CaO2 = (Hb * 1.34)(SaO2) + (0.003 * PaO2)  0.1735
 * DO2i = 10 x CI x CaO2
 */
export function CalculateHct(params:CalculatorParamType):number {
  
  const constant = params?.['constant'];
  const membrane_volume = params?.['membrane_volume'];
  const tubing_volume = params?.['tubing_volume'];
  const pump_volume = params?.['pump_volume'];
  const patient_weight = params?.['patient_weight'];
  const hematocrit = params?.['hematocrit'];

  if (membrane_volume === 0) return 0;
  if (tubing_volume === 0) return 0;
  // if (pump_volume === 0) return 0; // depends on
  if (patient_weight === 0) return 0;
  if (hematocrit === 0) return 0;

  // Step 1
  const CIRCUIT_PRIME = membrane_volume + tubing_volume + pump_volume;

  // Step 2
  const POST_HCT_P1 = patient_weight * constant * hematocrit
  const POST_HCT_P2 = CIRCUIT_PRIME + patient_weight * constant
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
export function enforceRange(input: HTMLInputElement) {
  // Parse input value as a float
  let value = parseFloat(input.value);
  
  // Check if the value is out of bounds and clamp if necessary
  if (value < 0.01) input.value = "0.01";
  else if (value > 1) input.value = "1";
}