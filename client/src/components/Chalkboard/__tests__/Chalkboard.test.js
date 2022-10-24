import { render, screen } from '@testing-library/react';
import mockMatch from '../../../mocks/responses/mockMatch.json';
import mockEvents from '../../../mocks/responses/mockEvents.json';
import Chalkboard from '../Chalkboard';
import replaceReactAriaIds from '../../../utils/replaceReactAriaIds';

const component = (
  <Chalkboard
    events={mockEvents.events[0].events}
    teams={{ home: mockMatch.match.home.teamId, away: mockMatch.match.away.teamId }}
  />
);

describe('renders chalkboard correctly', () => {
  test('renders radio button labels', async () => {
    render(component);
    ['home', 'away', 'both'].forEach(async (label) => {
      const labelElement = await screen.findByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  });

  test('renders radio buttons', async () => {
    render(component);
    const radioElement = await screen.findAllByRole('radio');
    expect(radioElement.length).toBe(3);
  });

  test('matches snapshot', async () => {
    const { container } = render(component);
    replaceReactAriaIds(container);
    expect(container).toMatchSnapshot();
  });
});
