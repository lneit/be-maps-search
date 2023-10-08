export interface TomtomLatLon {
  lat: string;
  long: string;
}

export interface TomtomResponseSummary {
  query: string;
  queryType: string;
  queryTime: number;
  numResults: number;
  offset: number;
  totalResults: number;
  fuzzyLevel: number;
  geoBias: TomtomLatLon;
}

type TomtomResultType =
  | 'POI'
  | 'Street'
  | 'Geography'
  | 'Point Address'
  | 'Address Range'
  | 'Cross Street';

export interface TomtomResultAddress {
  streetNumber?: string;
  streetName: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  countrySubdivisionCode: string;
  postalCode: string;
  extendedPostalCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName: string;
}

export interface TomtomResultViewPort {
  topLeftPoint: TomtomLatLon;
  btmRightPoint: TomtomLatLon;
}

export interface TomtomResponseResult {
  type: TomtomResultType;
  id: string;
  score: string; // double
  // Please note more fields are available in the API
  address: TomtomResultAddress;
  position: TomtomLatLon;
  viewport: TomtomResultViewPort;
}

export interface TomtomResponse {
  summary: TomtomResponseSummary;
  results: Array<TomtomResponseResult>;
}

type Subset<T extends U, U> = U; // eslint-disable-line @typescript-eslint/no-unused-vars

export type GetPlaceResult = { placeId: string } & Subset<
  TomtomResultAddress,
  {
    streetNumber?: string;
    countryCode: string;
    country: string;
    freeformAddress: string;
    municipality: string;
  }
>;
