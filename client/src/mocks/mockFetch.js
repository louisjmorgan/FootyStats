import mockMatches from 'mocks/responses/mockMatches.json';
import mockMatch from 'mocks/responses/mockMatch.json';
import mockEvents from 'mocks/responses/mockEvents.json';

export default async function mockFetch(url) {
  switch (url) {
    case '/api/matches': {
      return {
        ok: true,
        status: 200,
        json: async () => (mockMatches),
      };
    }
    case '/api/matches/1485449': {
      return {
        ok: true,
        status: 200,
        json: async () => (mockMatch),
      };
    }
    case '/api/matches/1485449/events': {
      return {
        ok: true,
        status: 200,
        json: async () => (mockEvents),
      };
    }
    default: {
      throw new Error(`Unhandled request: ${url}`);
    }
  }
}
