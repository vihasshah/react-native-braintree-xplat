// @flow

export type CardParameters = {
  number: string,
  cvv: string,
  expirationDate: string,
  cardholderName: string,
  firstName: string,
  lastName: string,
  company: string,
  countryName: string,
  countryCodeAlpha2: string,
  countryCodeAlpha3: string,
  countryCodeNumeric: string,
  locality: string,
  postalCode: string,
  region: string,
  streetAddress: string,
  extendedAddress: string,
};

export type IOSCardParameters = {
  number: string,
  cvv: string,
  expirationDate: string, // new BTCard has no expirationDate so use month and year
  expirationMonth: string,
  expirationYear: string,
  cardholderName: string,
  postalCode: string,
  streetAddress: string,
  extendedAddress: string,
  locality: string,
  region: string,
  countryName: string,
  countryCodeAlpha2: string,
  countryCodeAlpha3: string,
  countryCodeNumeric: string,
  firstName: string,
  lastName: string,
  company: string,
};

export type AndroidCardParameters = CardParameters;
