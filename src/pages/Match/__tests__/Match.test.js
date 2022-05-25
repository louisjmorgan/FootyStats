import { render, screen } from '@testing-library/react';
import mockFetch from 'mocks/mockFetch';
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
    render(<Match />);
    const titleElement = await screen.findByText('Wolves 1 : 1 Tottenham');
    expect(titleElement).toBeInTheDocument();
  });
});
