/**
 * ISO 3779 & US 49 CFR Part 565 Vehicle Identification Number (VIN) Validator Engine
 * Maintained by UseCOS Engineering (https://usecos.app/vin)
 *
 * Implements authoritative automotive standards:
 * - ISO 3779: Road vehicles — Vehicle identification number (VIN) — Content and structure
 * - ISO 3780: Road vehicles — World manufacturer identifier (WMI) code
 * - US 49 CFR Part 565: Vehicle Identification Number (VIN) Requirements (NHTSA)
 */

export interface VinValidationResult {
  valid: boolean;
  error?: string;
  wmi?: string;
  vds?: string;
  checkDigit?: string;
  modelYearChar?: string;
  modelYear?: number | null;
  plantCode?: string;
  sequentialNumber?: string;
}

export const VALID_CHARS = new Set('0123456789ABCDEFGHJKLMNPRSTUVWXYZ');

/**
 * Standard positional weight vector defined in ISO 3779 and US 49 CFR § 565.15
 */
export const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Transliteration lookup table converting alphanumeric characters to numeric values
 * Note: Letters I, O, and Q are strictly omitted under ISO 3779 to prevent confusion with 1 and 0.
 */
export const CHAR_VALUES: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

/**
 * Decodes the 10th character of a 17-character VIN into the vehicle model year.
 * Follows the 30-year cyclic encoding scheme (1980–2000, 2001–2009, 2010–2030).
 */
export function decodeModelYear(char: string): number | null {
  const c = char.toUpperCase();
  const cycle1: Record<string, number> = {
    A: 1980, B: 1981, C: 1982, D: 1983, E: 1984, F: 1985,
    G: 1986, H: 1987, J: 1988, K: 1989, L: 1990, M: 1991,
    N: 1992, P: 1993, R: 1994, S: 1995, T: 1996, V: 1997,
    W: 1998, X: 1999, Y: 2000,
  };
  const cycle2: Record<string, number> = {
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
    '6': 2006, '7': 2007, '8': 2008, '9': 2009,
  };
  const cycle3: Record<string, number> = {
    A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015,
    G: 2016, H: 2017, J: 2018, K: 2019, L: 2020, M: 2021,
    N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, V: 2027,
    W: 2028, X: 2029, Y: 2030,
  };
  return cycle3[c] ?? cycle2[c] ?? cycle1[c] ?? null;
}

/**
 * Calculates the expected check digit at position 9 for a given 17-character VIN.
 * Formula: sum(character_value * weight) mod 11.
 * If remainder is 10, check digit is 'X'.
 */
export function calculateCheckDigit(vin: string): string | null {
  if (vin.length !== 17) return null;
  const cleanVin = vin.toUpperCase();

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip position 9 (the check digit itself)
    const val = CHAR_VALUES[cleanVin[i]];
    if (val === undefined) return null;
    sum += val * VIN_WEIGHTS[i];
  }

  const remainder = sum % 11;
  return remainder === 10 ? 'X' : String(remainder);
}

/**
 * Validates a 17-character VIN against ISO 3779 and US 49 CFR Part 565 standards.
 */
export function validateVin(vin: string): VinValidationResult {
  const clean = vin.trim().toUpperCase();

  if (clean.length !== 17) {
    return { valid: false, error: 'VIN must be exactly 17 characters' };
  }

  for (const ch of clean) {
    if (!VALID_CHARS.has(ch)) {
      return {
        valid: false,
        error: `Invalid character "${ch}". VIN uses 0-9, A-Z (excluding I, O, Q)`,
      };
    }
  }

  const expectedCheckChar = calculateCheckDigit(clean);
  const actualCheckChar = clean[8];

  if (expectedCheckChar !== actualCheckChar) {
    return {
      valid: false,
      error: `Check digit mismatch at position 9: expected "${expectedCheckChar}", got "${actualCheckChar}"`,
    };
  }

  return {
    valid: true,
    wmi: clean.slice(0, 3),
    vds: clean.slice(3, 8),
    checkDigit: actualCheckChar,
    modelYearChar: clean[9],
    modelYear: decodeModelYear(clean[9]),
    plantCode: clean[10],
    sequentialNumber: clean.slice(11, 17),
  };
}

export const VIN_SECTIONS = [
  { start: 0, end: 3, label: 'WMI', desc: 'World Manufacturer Identifier' },
  { start: 3, end: 8, label: 'VDS', desc: 'Vehicle Descriptor Section' },
  { start: 8, end: 9, label: 'Check', desc: 'Check Digit (Position 9)' },
  { start: 9, end: 10, label: 'Year', desc: 'Model Year (Position 10)' },
  { start: 10, end: 11, label: 'Plant', desc: 'Assembly Plant Code (Position 11)' },
  { start: 11, end: 17, label: 'VIS', desc: 'Vehicle Identifier Section (Serial Number)' },
];
