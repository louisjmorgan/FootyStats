import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import mockFetch from 'mocks/mockFetch';
import replaceReactAriaIds from 'utils/replaceReactAriaIds';
import Home from '../Home';

beforeAll(() => jest.spyOn(global, 'fetch'));
beforeEach(() => global.fetch.mockImplementation(mockFetch));

describe('Correctly display list of matches as links', () => {
  test('obtains matches from api and renders them', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    const matchLinkElements = await screen.findAllByRole('link');
    expect(matchLinkElements.length).toBe(2);
  });

  test('renders match participants and score in the link text', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    const matchLinkElement = await screen.findByText('Wolves 1 : 1 Tottenham');
    expect(matchLinkElement).toBeInTheDocument();
  });

  test('link points to correct path', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    const matchLinkElements = await screen.findAllByRole('link');
    expect(matchLinkElements[0]).toHaveAttribute('href', '/matches/1485449');
  });
});

describe('matches snapshot', () => {
  test('matches snapshot', async () => {
    const { container } = await act(async () => render((
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )));
    replaceReactAriaIds(container);
    expect(container).toMatchSnapshot();
  });
});
