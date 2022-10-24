import { render, screen } from '@testing-library/react';
import mockMatch from '../../../mocks/responses/mockMatch.json';
import mockEvents from '../../../mocks/responses/mockEvents.json';
import Heatmaps from '../Heatmaps';

const component = (
  <Heatmaps
    players={{
      home: mockMatch.match.home.formations[0].playerIds,
      away: mockMatch.match.away.formations[0].playerIds,
    }}
    playerIdDictionary={mockMatch.match.playerIdNameDictionary}
    events={mockEvents.events[0].events}
  />
);

describe('renders heatmaps correctly', () => {
  test('renders radio labels correctly', async () => {
    render(component);
    ['home', 'away'].forEach(async (label) => {
      const labelElement = await screen.findByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  });

  test('renders radio buttons', async () => {
    render(component);
    const radioElement = await screen.findAllByRole('radio');
    expect(radioElement.length).toBe(2);
  });
  test('matches snapshot', async () => {
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});
