import { render } from '@testing-library/react';
import mockMatch from '../../../mocks/responses/mockMatch.json';
import MatchPlayer from '../MatchPlayer';

const handlePlayer = (selection, match) => {
  const { players } = match[selection.isHome ? 'home' : 'away'];
  const newPlayer = players.filter((p) => p.playerId === selection.id);
  return newPlayer[0];
};

const component = (
  <MatchPlayer
    data={
      handlePlayer(
        {
          isHome: true,
          id: mockMatch.match.home.formations[0].playerIds[0],
        },
        mockMatch.match,
      )
    }
  />
);

describe('player match stats rendered correctly', () => {
  test('matches snapshot', async () => {
    const matchPlayerEl = render(component);
    expect(matchPlayerEl).toMatchSnapshot();
  });
});
