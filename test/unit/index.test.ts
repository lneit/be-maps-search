import { getAutoCompleteDetails } from '../../src/index';

import * as MapAPI from '../../src/maps-api';

const originalEnv = process.env;

describe('maps-api unit tests', () => {
  describe('getPlaceAutocomplete', () => {
    beforeAll(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        TOMTOM_API_KEY: 'FAKE_TOMTOM_API_KEY'
      };
    });

    afterAll(() => {
      process.env = originalEnv;
    });
    it('maps results as expected', async () => {
      const getPlaceAutocompleteMock = jest
        .spyOn(MapAPI, 'getPlaceAutocomplete')
        .mockResolvedValueOnce([
          {
            placeId: '1',
            streetNumber: '',
            countryCode: 'US',
            country: 'United States',
            freeformAddress: 'Charlotte Street, Erie, PA',
            municipality: 'Erie'
          }
        ]);

      await getAutoCompleteDetails('Charlotte Street');

      expect(getPlaceAutocompleteMock).toHaveBeenCalledWith(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );
    });
    it('handles failed request', async () => {
      const getPlaceAutocompleteMock = jest.spyOn(
        MapAPI,
        'getPlaceAutocomplete'
      );

      await expect(getAutoCompleteDetails('Charlotte Street')).rejects.toThrow(
        Error
      );

      expect(getPlaceAutocompleteMock).toHaveBeenCalledWith(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );
    });
  });
});
