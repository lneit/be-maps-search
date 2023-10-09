import { getAutoCompleteDetails } from '../../src/index';

import * as MapAPI from '../../src/maps-api';

const originalEnv = process.env;

describe('maps-api unit tests', () => {
  beforeAll(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      TOMTOM_API_URL_BASE: 'https://api.tomtom.com/search/2/search',
      TOMTOM_API_KEY: 'FAKE_TOMTOM_API_KEY'
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });
  describe('getPlaceAutocomplete', () => {
    it('maps results as expected', async () => {
      const getPlaceAutocompleteMock = jest
        .spyOn(MapAPI, 'getPlaceAutocomplete')
        .mockResolvedValueOnce({
          summary: {
            numResults: 1,
            offset: 0,
            totalResults: 1
          },
          results: [
            {
              placeId: '1',
              streetNumber: '',
              countryCode: 'US',
              country: 'United States',
              freeformAddress: 'Charlotte Street, Erie, PA',
              municipality: 'Erie'
            }
          ]
        });

      await getAutoCompleteDetails('Charlotte Street');

      expect(getPlaceAutocompleteMock).toHaveBeenCalledWith(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street',
        undefined,
        undefined
      );
    });
    it('handles failed request', async () => {
      const getPlaceAutocompleteMock = jest
        .spyOn(MapAPI, 'getPlaceAutocomplete')
        .mockImplementationOnce(() => {
          throw new Error('Some error');
        });

      await expect(getAutoCompleteDetails('Charlotte Street')).rejects.toThrow(
        Error
      );

      expect(getPlaceAutocompleteMock).toHaveBeenCalledWith(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street',
        undefined,
        undefined
      );
    });
  });
});
