import { render, screen } from '@testing-library/react';
import mockMatch from '../../../mocks/responses/mockMatch.json';
import Formations from '../Formations';
import drawFormations from '../drawFormations';

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
  jest.mock('d3');

  test('renders pitch container', async () => {
    render(component);
    const pitchContainerElement = await screen.findByTestId('pitch-container');
    expect(pitchContainerElement).toBeInTheDocument();
  });

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
});

describe('formation graphics render correctly', () => {
  const data = {
    home: mockMatch.match.home.formations[0],
    away: mockMatch.match.away.formations[0],
  };
  const playerIdDictionary = mockMatch.match.playerIdNameDictionary;

  beforeEach(() => {
    render(<svg className="pitch" data-testid="pitch" />);
  });

  test('formations rendered with correct number of players', async () => {
    drawFormations(data, playerIdDictionary, jest.fn());
    const pitchElement = await screen.findByTestId('pitch');
    const groups = pitchElement.querySelectorAll('g');
    expect(groups.length).toBe(22);
  });
});
