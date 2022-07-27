import { render, screen, act } from '@testing-library/react';
import mockFetch from 'mocks/mockFetch';
import replaceReactAriaIds from 'utils/replaceReactAriaIds';
import Match from '../Match';

beforeAll(() => jest.spyOn(global, 'fetch'));
beforeEach(() => global.fetch.mockImplementation(mockFetch));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1485449',
  }),
}));

describe('correctly renders match info', () => {
  test('title contains participants and scoreline', async () => {
    act(() => {
      render(<Match />);
    });
    const titleElement = await screen.findByText('Wolves 1 : 1 Tottenham');
    expect(titleElement).toBeInTheDocument();
  });
});

describe('correctly renders tabs', () => {
  test('tab names are correctly rendered', async () => {
    act(() => {
      render(<Match />);
    });
    const formationsTab = await screen.findByText('Formations');
    const chalkboardTab = await screen.findByText('Chalkboard');
    const heatmapsTab = await screen.findByText('Heatmaps');

    expect(formationsTab).toBeInTheDocument();
    expect(chalkboardTab).toBeInTheDocument();
    expect(heatmapsTab).toBeInTheDocument();
  });
});

describe('matches snapshot', () => {
  test('matches snapshot', async () => {
    const { container } = await act(async () => render(<Match />));
    replaceReactAriaIds(container);
    expect(container).toMatchSnapshot();
  });
});
