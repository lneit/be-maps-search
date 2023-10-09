import axios from 'axios';
import { getPlaceAutocomplete } from '../../src/maps-api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const originalEnv = process.env;

describe('maps-api unit tests', () => {
  beforeAll(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      TOMTOM_API_URL_BASE: 'https://some-search-url',
      SEARCH_COUNTRY_SET: 'US'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });
  describe('getPlaceAutocomplete', () => {
    it('maps results as expected', async () => {
      const data = {
        summary: {
          numResults: 2,
          offset: 0,
          totalResults: 2
        },
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
      mockedAxios.get.mockResolvedValue({ data });
      const res = await getPlaceAutocomplete(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );

      expect(axios.get).toHaveBeenCalledWith(
        `https://some-search-url/Charlotte%20Street.json`,
        {
          params: {
            key: 'FAKE_TOMTOM_API_KEY',
            limit: 100,
            ofs: 0,
            countrySet: 'US'
          }
        }
      );

      expect(res).toHaveProperty('summary');
      expect(res.summary).toHaveProperty('numResults');
      expect(res.summary).toHaveProperty('offset');
      expect(res.summary).toHaveProperty('totalResults');
      expect(res).toHaveProperty('results');

      const firstRes = res.results[0];
      expect(firstRes).toHaveProperty('placeId');
      expect(firstRes.placeId).toBe('1');
      expect(firstRes).toHaveProperty('streetNumber');
      expect(firstRes).toHaveProperty('countryCode');
      expect(firstRes).toHaveProperty('country');
      expect(firstRes).toHaveProperty('freeformAddress');
      expect(firstRes).toHaveProperty('municipality');
    });
    it('calls tomtom API with provided limit, offset and countrySet values', async () => {
      process.env = {
        ...originalEnv,
        TOMTOM_API_URL_BASE: 'https://some-search-url',
        SEARCH_COUNTRY_SET: 'US'
      };
      const data = {
        summary: {
          numResults: 0,
          offset: 0,
          totalResults: 0
        },
        results: []
      };

      mockedAxios.get.mockResolvedValue({ data });

      await getPlaceAutocomplete(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street',
        10,
        20
      );

      expect(axios.get).toHaveBeenCalledWith(
        `https://some-search-url/Charlotte%20Street.json`,
        {
          params: {
            key: 'FAKE_TOMTOM_API_KEY',
            limit: 10,
            ofs: 20,
            countrySet: 'US'
          }
        }
      );
    });
    it('sets search limit, offset and country defaults when not provided', async () => {
      process.env = {
        ...originalEnv,
        TOMTOM_API_URL_BASE: 'https://some-search-url'
      };
      const data = {
        summary: {
          numResults: 0,
          offset: 0,
          totalResults: 0
        },
        results: []
      };

      mockedAxios.get.mockResolvedValue({ data });

      await getPlaceAutocomplete('FAKE_TOMTOM_API_KEY', 'Charlotte Street');

      expect(axios.get).toHaveBeenCalledWith(
        `https://some-search-url/Charlotte%20Street.json`,
        {
          params: {
            key: 'FAKE_TOMTOM_API_KEY',
            limit: 100,
            ofs: 0,
            countrySet: 'AU'
          }
        }
      );
    });

    it('handles empty results', async () => {
      const data = {
        summary: {
          numResults: 0,
          offset: 0,
          totalResults: 0
        },
        results: []
      };
      mockedAxios.get.mockResolvedValue({ data });
      const res = await getPlaceAutocomplete(
        'FAKE_TOMTOM_API_KEY',
        'Charlotte Street'
      );
      expect(res.results.length).toBe(0);
    });

    it('throws on error', async () => {
      mockedAxios.get.mockImplementationOnce(() => {
        throw new Error('Some error');
      });
      await expect(
        getPlaceAutocomplete(process.env.TOMTOM_API_KEY as string, '')
      ).rejects.toThrow();
    });
  });
});
