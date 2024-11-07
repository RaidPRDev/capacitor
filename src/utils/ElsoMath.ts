import { CalculatorParamType } from "@/ui/navigation/branching/types";

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

  const group = (height * weight) / 2;
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
 * ELSOBA_CALC_010_02
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
 * ELSOBA_CALC_010_02
 * Convert Inches (in) to Centimeters (cm)
 * 
 * ft * 12in/ft * 2.54cm/in = cm
 * 
 */
export function ConvertPoundsToKilograms(params:CalculatorParamType):number {
  const pounds = params?.['pounds'];
  if (pounds === 0) return 0;

  const group = pounds * 2.2;
  return group;  
}

/**
 * ELSOBA_CALC_010_04
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
 * ELSOBA_CALC_010_05
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
 * ELSOBA_CALC_010_06
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
 * ELSOBA_CALC_010_07
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