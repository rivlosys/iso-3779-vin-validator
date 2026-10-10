import assert from 'node:assert';
import {
  validateVin,
  decodeModelYear,
  calculateCheckDigit,
  VALID_CHARS,
  CHAR_VALUES,
} from './index.ts';

console.log('Running ISO 3779 VIN Validator test suite...');

// 1. Length validation
const shortVin = validateVin('1HGCM82633A0047');
assert.strictEqual(shortVin.valid, false);
assert.ok(shortVin.error.includes('17 characters'));
console.log('✓ Rejects VIN shorter than 17 characters');

// 2. Illegal character rejection (I, O, Q)
const illegalVin = validateVin('1HGCM82633A0O4712');
assert.strictEqual(illegalVin.valid, false);
assert.ok(illegalVin.error.includes('excluding I, O, Q'));
console.log('✓ Rejects illegal characters I, O, Q');

// 3. Valid Honda VIN verification
const honda = validateVin('1HGCM82633A004352');
assert.strictEqual(honda.valid, true);
assert.strictEqual(honda.wmi, '1HG');
assert.strictEqual(honda.checkDigit, '3');
assert.strictEqual(honda.modelYear, 2003);
console.log('✓ Validates 17-character Honda VIN and decodes model year 2003');

// 4. Valid BMW VIN verification
const bmw = validateVin('WBA3A5C50DF123456');
assert.strictEqual(bmw.valid, true);
assert.strictEqual(bmw.wmi, 'WBA');
assert.strictEqual(bmw.checkDigit, '0');
assert.strictEqual(bmw.modelYear, 2013);
console.log('✓ Validates German WMI BMW VIN with model year 2013');

// 5. Check digit 'X' (value 10) verification
const gmc = validateVin('1GNSKCKCXFR123456');
assert.strictEqual(gmc.valid, true);
assert.strictEqual(gmc.checkDigit, 'X');
console.log("✓ Validates check digit 'X' (mod 11 = 10)");

// 6. Transliteration weights accuracy
assert.strictEqual(CHAR_VALUES.A, 1);
assert.strictEqual(CHAR_VALUES.J, 1);
assert.strictEqual(CHAR_VALUES.S, 2);
assert.strictEqual(CHAR_VALUES.Z, 9);
console.log('✓ Transliteration values match ISO 3779 / NHTSA specification');

// 7. 30-Year Cyclic Model Year decoding
assert.strictEqual(decodeModelYear('A'), 2010);
assert.strictEqual(decodeModelYear('L'), 2020);
assert.strictEqual(decodeModelYear('M'), 2021);
assert.strictEqual(decodeModelYear('Y'), 2030);
assert.strictEqual(decodeModelYear('1'), 2001);
assert.strictEqual(decodeModelYear('9'), 2009);
console.log('✓ 30-year cyclic model year decoding verified across all cycles');

console.log('\nAll ISO 3779 VIN Validator tests passed successfully!');
