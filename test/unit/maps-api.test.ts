import axios from 'axios';
import { getPlaceAutocomplete } from '../../src/maps-api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('maps-api unit tests', () => {
  describe('getPlaceAutocomplete', () => {
    it('maps results as expected', async () => {
      const data = {
        results: [
          {
            type: 'Street',
            id: '1',
            score: 4.6116523743,
            address: {
              streetName: 'Charlotte Street',
              municipality: 'Erie',
              countrySecondarySubdivision: 'Erie',
              countrySubdivision: 'PA',
              countrySubdivisionName: 'Pennsylvania',
              countrySubdivisionCode: 'PA',
              countryCode: 'US',
              country: 'United States',
              countryCodeISO3: 'USA',
              freeformAddress: 'Charlotte Street, Erie, PA',
              localName: 'Erie'
            },
            position: { lat: 42.093504, lon: -80.107175 },
            viewport: { topLeftPoint: [Object], btmRightPoint: [Object] }
          },
          {
            type: 'Street',
            id: '2',
            score: 4.6116523743,
            address: {
              streetName: 'Charlotte Street',
              municipality: 'Detroit',
              countrySecondarySubdivision: 'Wayne',
              countrySubdivision: 'MI',
              countrySubdivisionName: 'Michigan',
              countrySubdivisionCode: 'MI',
              countryCode: 'US',
              country: 'United States',
              countryCodeISO3: 'USA',
              freeformAddress: 'Charlotte Street, Detroit, MI',
              localName: 'Detroit'
            },
            position: { lat: 42.342483, lon: -83.061093 },
            viewport: { topLeftPoint: [Object], btmRightPoint: [Object] }
          }
        ]
      };
      mockedAxios.get.mockResolvedValue({
        data
      });
      const res = await getPlaceAutocomplete(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.tomtom.com/search/2/search/Charlotte Street.json'`,
        {
          params: {
            key: 'FAKE_TOMTOM_API_KEY',
            limit: 100
          }
        }
      );

      expect(res.length).toBe(2);
      const firstRes = res[0];
      expect(firstRes).toHaveProperty('placeId');
      expect(firstRes.placeId).toBe('1');
      expect(firstRes).toHaveProperty('streetNumber');
      expect(firstRes).toHaveProperty('countryCode');
      expect(firstRes).toHaveProperty('country');
      expect(firstRes).toHaveProperty('freeformAddress');
      expect(firstRes).toHaveProperty('municipality');
    });
    it('handles empty results', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          results: []
        }
      });
      const res = await getPlaceAutocomplete(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );
      expect(res.length).toBe(0);
    });
  });
});
