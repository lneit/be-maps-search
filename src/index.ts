import { getPlaceAutocomplete } from './maps-api';
import { GetPlaceResponse } from './interfaces';
import { isValidAddress, isValidLimit } from './utils';

/**
 * An interface function for the integration with TomTom default search service - Fuzzy Search.
 * Please see https://developer.tomtom.com/search-api/documentation/search-service/search-service and
 * https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search.
 * 
 * The search country set is limited by default to Australia (AU). The deafault can be overriden using 
 * SEARCH_COUNTRY_SET environment variable. 
 * 
 * @param address: A search address segment, e.g street name. Allowed length range is between 1 and 100 characters.
 * @param limit: Optional. Maximum number of responses that will be returned. Default value: 100. 
 * Maximum value: 100.
 * @param offset: Optional. Starting offset of the returned results within the full result set.
Default value: 0
 * @returns Promise<GetPlaceResponse> as specified in the interfaces.ts or throws an error.
 */
export async function getAutoCompleteDetails(
  address: string,
  limit?: number,
  offset?: number
): Promise<GetPlaceResponse> | never {
  const apiKey = process.env.TOMTOM_API_KEY;

  if (!isValidAddress(address)) {
    const msg =
      'Invalid address value. Allowed address length should range between 1 and 100';
    console.warn(msg);
    throw new Error(msg);
  }

  if (!isValidLimit(limit)) {
    const msg =
      'Invalid limit value. Minimum allowed value is 0. Maximum allowed value is 100';
    console.warn(msg);
    throw new Error(msg);
  }

  // get mapped autocomplete results
  const res = await getPlaceAutocomplete(
    apiKey as string,
    address,
    limit,
    offset
  );

  return res;
}
