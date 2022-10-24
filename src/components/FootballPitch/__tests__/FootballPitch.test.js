import { render } from '@testing-library/react';
import FootballPitch from '../FootballPitch';

describe('football pitch graphic renders correctly', () => {
  test('pitch rendered with correct number of rects', async () => {
    const pitchElement = render(<FootballPitch width={1000} height={500} stroke={5} />).baseElement;
    const rects = pitchElement.querySelectorAll('rect');
    expect(rects.length).toBe(7);
  });

  test('pitch rendered with correct number of circles', async () => {
    const pitchElement = render(<FootballPitch width={1000} height={500} stroke={5} />).baseElement;
    const circles = pitchElement.querySelectorAll('circle');
    expect(circles.length).toBe(4);
  });

  test('pitch rendered with correct number of paths', async () => {
    const pitchElement = render(<FootballPitch width={1000} height={500} stroke={5} />).baseElement;
    const paths = pitchElement.querySelectorAll('path');
    expect(paths.length).toBe(2);
  });
});
