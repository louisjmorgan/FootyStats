import mockMatches from 'mocks/responses/mockMatches.json'
import mockMatch from 'mocks/responses/mockMatch.json'

export default async function mockFetch(url) {
    switch (url) {
        case '/api/matches': {
            return {
                ok: true,
                status: 200,
                json: async () => (mockMatches),
              }
        }
        case '/api/matches/1485449': {
            return {
                ok: true,
                status: 200,
                json: async () => (mockMatch),
              }
        }
        default: {
            throw new Error(`Unhandled request: ${url}`)
          }
    }
}