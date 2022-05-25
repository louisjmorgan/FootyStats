import { render, screen } from '@testing-library/react';
import * as d3 from 'd3';
import { drawFootballPitch } from '../drawFootballPitch';

describe('football pitch graphic renders correctly', () => {
  beforeEach(() => {
    render(<div className="pitch-container" data-testid="pitch-container" />);
  });

  afterEach(() => {
    d3.select('.pitch-container').selectAll('svg').remove();
  });

  test('renders pitch', async () => {
    drawFootballPitch();
    const pitchElement = await screen.findByTestId('pitch');
    expect(pitchElement).toBeInTheDocument();
  });

  test('pitch rendered with correct number of rects', async () => {
    drawFootballPitch();
    const pitchElement = await screen.findByTestId('pitch');
    const rects = pitchElement.querySelectorAll('rect');
    expect(rects.length).toBe(6);
  });

  test('pitch rendered with correct number of circles', async () => {
    drawFootballPitch();
    const pitchElement = await screen.findByTestId('pitch');
    const circles = pitchElement.querySelectorAll('circle');
    expect(circles.length).toBe(4);
  });

  test('pitch rendered with correct number of paths', async () => {
    drawFootballPitch();
    const pitchElement = await screen.findByTestId('pitch');
    const paths = pitchElement.querySelectorAll('path');
    expect(paths.length).toBe(2);
  });
});
