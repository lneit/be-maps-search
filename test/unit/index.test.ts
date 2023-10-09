import { getAutoCompleteDetails } from '../../src/index';

import * as MapAPI from '../../src/maps-api';

const originalEnv = process.env;

describe('index unit tests', () => {
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
  describe('getAutoCompleteDetails', () => {
    it('calls getPlaceAutocomplete with expected parameters', async () => {
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
    it('throws when called with a bad limit value', async () => {
      await expect(
        getAutoCompleteDetails('Charlotte Street', 1000)
      ).rejects.toThrow(
        'Invalid limit value. Minimum allowed value is 0. Maximum allowed value is 100'
      );
    });
    it('throws on failed getPlaceAutocomplete call', async () => {
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
