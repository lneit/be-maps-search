# Scenario:

A developer on our team was working on integrating the TomTom API. They did a great job laying the groundwork, but they've recently been promoted to a new project that requires their full attention.

We are pretty confident the developer managed to complete the majority of the initial part of the integration, however there might be a bug or two to be discovered.

Your task is to finish off this implementation, ensuring the requirements are met with passing tests.

# Task:

To take a partial address input and return full address suggestions along with the address broken into its individual components using the TomTom API.

# Resources:

Place Search Documentation: https://developer.tomtom.com/search-api/documentation/search-service/search-service

API Key: [TOMTOM_API_KEY]

# Install:

1. npm install

# Test:

1. npm install

## Unit Tests

2. npm test

## Integration Tests

2. Copy .env.example to .env

```bash
   cp .env.example .env
```

3. Set your tomtom API key value in .env

4. npm run e2e

## Test Coverage

2. npm run coverage

# Requirements:

1. All tests should pass and ensure good coverage for new work
2. We only allow Australian addresses to be returned
3. Code should be maintainable and consistent
4. The result elements should contain important information about the place (country, municipality, etc)
5. The returned result should be typed and easily consumable via users of the library
6. No front-end requirements are necessary, this is purely a backend NodeJS library

# TODO

1. Format and lint the code base (done)
2. Add Husky pre-commit hooks (done)
3. Add unit tests (done)
4. Add unit test coverage (done)
5. Env var for a country of concern (done)
6. Pagination support in the API req/resp (done)
7. Review the types
8. Add parameter validation (done)
9. Test publishing to npm (played with :)
