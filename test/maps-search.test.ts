import { config } from 'dotenv';
import { describe } from '@jest/globals';
import { getPlaceAutocomplete } from '../src/maps-api';
import { getAutoCompleteDetails } from '../src';

config();

const originalEnv = process.env;

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
  describe('getAutoCompleteDetails', () => {
    beforeAll(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        SEARCH_COUNTRY_SET: 'US'
      };
    });

    afterAll(() => {
      process.env = originalEnv;
    });
    it('returns a promise', () => {
      const res = getAutoCompleteDetails('Charlotte Street');
      expect(res).toBeInstanceOf(Promise);
    });

    it('can fetch from the autocomplete api', async () => {
      const res = await getAutoCompleteDetails('Charlotte Street');
      const firstRes = res.results[0];
      expect(firstRes).toHaveProperty('placeId');
      expect(firstRes).toHaveProperty('streetNumber');
      expect(firstRes).toHaveProperty('countryCode');
      expect(firstRes).toHaveProperty('country');
      expect(firstRes).toHaveProperty('freeformAddress');
      expect(firstRes).toHaveProperty('municipality');
    });
  });

  describe('getPlaceAutocomplete', () => {
    it('handles no results', async () => {
      const res = await getPlaceAutocomplete(
        process.env.TOMTOM_API_KEY as string,
        'asfasffasfasafsafs'
      );
      expect(res.results).toStrictEqual([]);
    });

    it('throws on error', async () => {
      await expect(
        getPlaceAutocomplete(process.env.TOMTOM_API_KEY as string, '')
      ).rejects.toThrow();
    });
  });
});
