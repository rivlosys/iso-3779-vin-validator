# ISO 3779 & US 49 CFR Part 565 VIN Validator Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Standards](https://img.shields.io/badge/Standards-ISO%203779%20%7C%20NHTSA%2049%20CFR%20565-success.svg)](https://usecos.app/vin)

> **Zero-dependency TypeScript library for validating 17-character Vehicle Identification Numbers (VINs), verifying mathematical Position 9 Modulo-11 check digits, and decoding 30-year cyclic model years under ISO 3779 and US 49 CFR Part 565.**

Live interactive implementation: [UseCOS VIN Decoder & Recall Hub](https://usecos.app/vin).

---

## Overview

Under **ISO 3779**, **ISO 3780**, and the United States National Highway Traffic Safety Administration (**NHTSA 49 CFR Part 565**), every road vehicle manufactured since 1981 carries a unique 17-character Vehicle Identification Number.

In North America, position 9 is reserved as a mandatory **mathematical check digit** calculated via a weighted modulo 11 algorithm. This check detects over 95% of transcription errors, accidental typos, and fraudulent VIN tampering.

---

## VIN Structure Anatomy

A 17-character VIN is broken into three distinct international sections:

| Characters | Section | Name | Description |
| :--- | :--- | :--- | :--- |
| **1 – 3** | **WMI** | World Manufacturer Identifier | Geographic region, country of manufacture, and vehicle manufacturer. |
| **4 – 8** | **VDS** | Vehicle Descriptor Section | Model line, body style, engine type, transmission, and restraint systems. |
| **9** | **Check** | Check Digit | Mathematical verification digit (`0`–`9` or `X`). |
| **10** | **VIS** | Model Year | 30-year cyclic alphanumeric encoding representing the vehicle year. |
| **11** | **VIS** | Assembly Plant | Manufacturer-specific assembly plant identification code. |
| **12 – 17** | **VIS** | Sequential Production Number | Unique vehicle serial number on the production line. |

> **Prohibited Characters:** Under ISO 3779 § 4.1, the letters **`I`**, **`O`**, and **`Q`** are strictly forbidden to prevent visual confusion with the digits `1` and `0`.

---

## Check Digit Algorithm & Mathematical Formulation

### 1. Transliteration Values
Each alphanumeric character is mapped to a designated integer value:

| Character | Value | Character | Value | Character | Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `0` – `9` | $0 - 9$ | `E` | $5$ | `P` | $7$ |
| `A`, `J` | $1$ | `F` | $6$ | `R` | $9$ |
| `B`, `K`, `S` | $2$ | `G` | $7$ | `T` | $3$ |
| `C`, `L`, `T` | $3$ | `H` | $8$ | `U` | $4$ |
| `D`, `M` | $4$ | `N` | $5$ | `V` | $5$ |
| `W` | $6$ | `X` | $7$ | `Y` | $8$ |
| `Z` | $9$ | | | | |

### 2. Positional Weight Vector
Each position in the 17-character string is assigned a statutory weight:

$$\vec{w} = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]$$

*(Notice weight $0$ at index 8 corresponds to position 9, the check digit itself).*

### 3. Modulo 11 Calculation

$$\text{Sum} = \sum_{i=1}^{17} \vec{w}_i \cdot v(c_i)$$

$$\text{Check Digit} = \text{Sum} \pmod{11}$$

If $\text{Remainder} = 10$, the check character is represented by Roman numeral **`X`**.

---

## Model Year Cyclic Decoding (Position 10)

Model years rotate through a 30-year cycle using 21 uppercase letters (omitting `I`, `O`, `Q`, `U`, `Z`) followed by digits `1`–`9`:

* **Cycle 1 (1980–2000):** `A` (1980) $\dots$ `Y` (2000)
* **Cycle 2 (2001–2009):** `1` (2001) $\dots$ `9` (2009)
* **Cycle 3 (2010–2030):** `A` (2010) $\dots$ `Y` (2030)

---

## Installation & Usage

```bash
npm install iso-3779-vin-validator
```

### TypeScript Example:

```typescript
import { validateVin, decodeModelYear } from 'iso-3779-vin-validator';

// 1. Validate a complete 17-character VIN
const result = validateVin('1HGCM82633A004352');

if (result.valid) {
  console.log('WMI:', result.wmi);                       // "1HG" (Honda USA)
  console.log('Check Digit:', result.checkDigit);       // "3"
  console.log('Model Year:', result.modelYear);         // 2003
  console.log('Serial Number:', result.sequentialNumber); // "004352"
} else {
  console.error('Validation failed:', result.error);
}

// 2. Decode model year directly
console.log(decodeModelYear('P')); // 2023
console.log(decodeModelYear('T')); // 2026
```

---

## Edge Cases: North America vs European Market (EU)

While all modern vehicles sold in the United States, Canada, and Mexico **mandate** the mathematical check digit at position 9 under federal regulation, European domestic vehicles (which do not export to North America) sometimes treat position 9 as an arbitrary manufacturer-assigned descriptor code.

This engine flags non-matching check digits while clearly identifying whether the syntax adheres to ISO 3779 structure.

---

## Live Implementation & Tools

- **Interactive Vehicle Lookup**: [UseCOS Free VIN Decoder & Recall Hub](https://usecos.app/vin)
- **Used Car Cross-Check**: [UseCOS Used Car VIN Mismatch & Scam Checker](https://usecos.app/vin/used-car-vin-mismatch-scam-checker)
- **Ontario UVIP Checklist**: [UseCOS Used Vehicle Information Package Guide](https://usecos.app/vin/ontario-uvip-checklist)

---

## License

MIT © [UseCOS Engineering](https://usecos.app). Open-source for developers, automotive engineers, and consumer protection platforms.
