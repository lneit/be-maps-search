import { getPlaceAutocomplete } from './maps-api';
import { GetPlaceResult } from './interfaces';

export async function getAutoCompleteDetails(
  address: string
): Promise<GetPlaceResult[]> {
  const apiKey = process.env.TOMTOM_API_KEY;

  // get mapped autocomplete results
  const res = await getPlaceAutocomplete(apiKey as string, address);

  return res;
}
