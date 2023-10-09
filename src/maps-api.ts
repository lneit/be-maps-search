import axios from 'axios';
import { GetPlaceResponse, TomtomResponseResult } from './interfaces';
import { fixedEncodeURIComponent } from './utils';

/**
 * A wrapper function for the integration with TomTom default search service - Fuzzy Search.
 * Please see https://developer.tomtom.com/search-api/documentation/search-service/search-service and
 * https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search.
 * 
 * The search country set is limited by default to Australia (AU). The deafault can be overriden using 
 * SEARCH_COUNTRY_SET environment variable. 
 * 
 * @param key: Tomtom API key. Set using TOMTOM_API_KEY environment variable.
 * @param address: A search address segment, e.g street name
 * @param limit: Optional. Maximum number of responses that will be returned. Default value: 100. Maximum value: 100.
 * @param offset: Optional. Starting offset of the returned results within the full result set.
Default value: 0
 * @returns Promise<GetPlaceResponse> as specified in the interfaces.ts or throws an error.
 */
export async function getPlaceAutocomplete(
  key: string,
  address: string,
  limit?: number,
  offset?: number
): Promise<GetPlaceResponse> | never {
  // Normalise the address string
  const escapedAddress = fixedEncodeURIComponent(address);

  const url = `${process.env.TOMTOM_API_URL_BASE}/${escapedAddress}.json`;
  try {
    const autocomplete = await axios.get(url, {
      params: {
        key,
        limit: limit ?? 100,
        ofs: offset ?? 0,
        countrySet: `${process.env.SEARCH_COUNTRY_SET ?? 'AU'}`
      }
    });

    return {
      summary: {
        numResults: autocomplete.data.summary.numResults,
        offset: autocomplete.data.summary.offset,
        totalResults: autocomplete.data.summary.totalResults
      },
      results: autocomplete.data.results.map((result: TomtomResponseResult) => {
        return {
          placeId: result.id,
          streetNumber: result.address.streetNumber || '',
          countryCode: result.address.countryCode,
          country: result.address.country,
          freeformAddress: result.address.freeformAddress,
          municipality: result.address.municipality
        };
      })
    };
  } catch (error) {
    console.error(`An error ocurred while calling tomtom GET ${url}: ${error}`);
    throw error;
  }
}
