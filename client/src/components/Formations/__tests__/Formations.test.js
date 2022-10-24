import { render, screen } from '@testing-library/react';
import mockMatch from '../../../mocks/responses/mockMatch.json';
import Formations from '../Formations';

const component = (
  <Formations
    data={{
      home: mockMatch.match.home.formations,
      away: mockMatch.match.away.formations,
    }}
    maxMinute={mockMatch.match.maxMinute}
    playerIdDictionary={mockMatch.match.playerIdNameDictionary}
    setPlayer={jest.fn()}
  />
);

describe('renders football pitch container and slider correctly', () => {
  // test('renders pitch container', async () => {
  //   render(component);
  //   const pitchContainerElement = await screen.findByTestId('pitch-container');
  //   expect(pitchContainerElement).toBeInTheDocument();
  // });

  test('renders slider label', async () => {
    render(component);
    const labelElement = await screen.findByText(/^Minute:/);
    expect(labelElement).toBeInTheDocument();
  });

  test('renders slider', async () => {
    render(component);
    const sliderElement = await screen.findByRole('slider');
    expect(sliderElement).toBeInTheDocument();
  });

  test('renders player circles', async () => {
    render(component);
    const formationsGroup = screen.getByTestId('formations');
    const circles = formationsGroup.querySelectorAll('circle');
    expect(circles.length).toBe(22);
  });

  test('renders player names and numbers', async () => {
    render(component);
    // check names
    mockMatch.match.home.formations[0].playerIds.map(async (playerId) => {
      const playerName = await screen.findByText(mockMatch.match.playerIdNameDictionary[playerId]);
      expect(playerName).toBeInTheDocument();
    });

    mockMatch.match.away.formations[0].playerIds.map(async (playerId) => {
      const playerName = await screen.findByText(mockMatch.match.playerIdNameDictionary[playerId]);
      expect(playerName).toBeInTheDocument();
    });

    // check numbers
    mockMatch.match.home.formations[0].jerseyNumbers.map(async (number) => {
      const jerseyNumber = await screen.findByText(number);
      expect(jerseyNumber).toBeInTheDocument();
    });

    mockMatch.match.away.formations[0].jerseyNumbers.map(async (number) => {
      const jerseyNumber = await screen.findByText(number);
      expect(jerseyNumber).toBeInTheDocument();
    });
  });

  test('matches snapshot', async () => {
    const formationsEl = render(component);
    expect(formationsEl).toMatchSnapshot();
  });
});
