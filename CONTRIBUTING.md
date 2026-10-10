# Contributing to ISO 3779 VIN Validator

Thank you for contributing to the **ISO 3779 & US 49 CFR Part 565 VIN Validator**!

This project is an open-source reference automotive implementation maintained by [UseCOS](https://usecos.app). Our mission is to provide clean, zero-dependency validation algorithms for developers building automotive marketplaces, dealer management systems, and consumer vehicle history tools.

---

## Areas Where Contributions Are Welcomed

1. **WMI Database Expansions**: Expanding the World Manufacturer Identifier (WMI) country and manufacturer prefix registry.
2. **European vs North American Edge Cases**: Documenting regional differences where European market manufacturers occasionally assign zero or arbitrary values to position 9 instead of the North American mathematical check digit.
3. **Automated Test Cases**: Adding verified test VINs across diverse manufacturers (Tesla, Ford, Honda, Toyota, BMW, Chevrolet).

---

## Standards

- Zero external runtime dependencies.
- Strict adherence to ISO 3779 and US 49 CFR Part 565.
- All tests (`node test.mjs`) must pass before opening a pull request.

---

## Live Implementations

- [UseCOS Free VIN Decoder & Recall Hub](https://usecos.app/vin)
- [UseCOS Canadian vs US VIN Guide](https://usecos.app/guides/canadian-vs-us-vin)
