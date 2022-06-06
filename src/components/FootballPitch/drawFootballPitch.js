import * as d3 from 'd3';

const WIDTH = 1000;
const HEIGHT = 500;
const STROKE_WIDTH = 5;

function drawFootballPitch(ref, instance) {
  // let container;
  // if (ref) container = d3.select(ref);
  // else container = d3.select('.pitch-container');

  const container = d3.select(ref)// select the pitch element
    .append('svg') // append an SVG element to the body
    .attr('width', WIDTH + STROKE_WIDTH * 2)
    .attr('height', HEIGHT + STROKE_WIDTH * 2)
    .style('display', 'block')
    .classed('mx-auto', true)
    .classed(`${instance}`, true);

  // draw a rectangle - pitch
  container.append('rect') // attach a rectangle
    .attr('x', 0) // position the left of the rectangle
    .attr('y', 0) // position the top of the rectangle
    .attr('height', HEIGHT) // set the height
    .attr('width', WIDTH) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a rectangle - halves
  container.append('rect') // attach a rectangle
    .attr('x', 0) // position the left of the rectangle
    .attr('y', 0) // position the top of the rectangle
    .attr('height', HEIGHT) // set the height
    .attr('width', WIDTH / 2) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a circle - center circle
  container.append('circle') // attach a circle
    .attr('cx', WIDTH / 2) // position the x-centre
    .attr('cy', HEIGHT / 2) // position the y-centre
    .attr('r', HEIGHT / 10) // set the radius
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', 'none'); // set the fill colour

  // draw a rectangle - penalty area 1
  container.append('rect') // attach a rectangle
    .attr('x', 0) // position the left of the rectangle
    .attr('y', HEIGHT / 4.75) // position the top of the rectangle
    .attr('height', HEIGHT / 1.75) // set the height
    .attr('width', WIDTH / 6) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a rectangle - penalty area 2
  container.append('rect') // attach a rectangle
    .attr('x', (WIDTH * 5) / 6) // position the left of the rectangle
    .attr('y', HEIGHT / 4.75) // position the top of the rectangle
    .attr('height', HEIGHT / 1.75) // set the height
    .attr('width', WIDTH / 6) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a rectangle - six yard box 1
  container.append('rect') // attach a rectangle
    .attr('x', 0) // position the left of the rectangle
    .attr('y', HEIGHT / 2.7) // position the top of the rectangle
    .attr('height', HEIGHT / 3.8) // set the height
    .attr('width', WIDTH / 16.7) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a rectangle - six yard box 2
  container.append('rect') // attach a rectangle
    .attr('x', WIDTH - WIDTH / 16.7) // position the left of the rectangle
    .attr('y', HEIGHT / 2.7) // position the top of the rectangle
    .attr('height', HEIGHT / 3.8) // set the height
    .attr('width', WIDTH / 16.7) // set the width
    .style('stroke-width', STROKE_WIDTH) // set the stroke width
    .style('stroke', '#001400') // set the line colour
    .style('fill', '#80B280'); // set the fill colour

  // draw a circle - penalty spot 1
  container.append('circle') // attach a circle
    .attr('cx', WIDTH / 8.3) // position the x-centre
    .attr('cy', HEIGHT / 2) // position the y-centre
    .attr('r', HEIGHT / 100) // set the radius
    .style('fill', '#001400'); // set the fill colour

  // draw a circle - penalty spot 2
  container.append('circle') // attach a circle
    .attr('cx', WIDTH - WIDTH / 8.3) // position the x-centre
    .attr('cy', HEIGHT / 2) // position the y-centre
    .attr('r', HEIGHT / 100) // set the radius
    .style('fill', '#001400'); // set the fill colour

  // draw a circle - center spot
  container.append('circle') // attach a circle
    .attr('cx', WIDTH / 2) // position the x-centre
    .attr('cy', HEIGHT / 2) // position the y-centre
    .attr('r', HEIGHT / 100) // set the radius
    .style('fill', '#001400'); // set the fill colour

  const arc = d3.arc()
    .innerRadius(WIDTH / 14.3)
    .outerRadius(WIDTH / 14.3 + STROKE_WIDTH)
    .startAngle(0.75) // radians
    .endAngle(2.4); // just radians

  const arc2 = d3.arc()
    .innerRadius(WIDTH / 14.3)
    .outerRadius(WIDTH / 14.3 + STROKE_WIDTH)
    .startAngle(-0.75) // radians
    .endAngle(-2.4); // just radians

  container.append('path')
    .attr('d', arc)
    .attr('fill', '#001400')
    .attr('transform', `translate(${(WIDTH / 8.5) + STROKE_WIDTH}, ${(HEIGHT / 2) + STROKE_WIDTH})`);

  container.append('path')
    .attr('d', arc2)
    .attr('fill', '#001400')
    .attr('transform', `translate(${(WIDTH - WIDTH / 8.5) + STROKE_WIDTH}, ${(HEIGHT / 2) + STROKE_WIDTH})`);

  container.selectAll('rect').attr('transform', `translate(${STROKE_WIDTH}, ${STROKE_WIDTH})`);
  container.selectAll('circle').attr('transform', `translate(${STROKE_WIDTH}, ${STROKE_WIDTH})`);

  container.attr('data-testid', 'pitch');
}

function clearFootballPitch(ref) {
  d3.select(ref)
    .selectAll('svg').remove();
}

export { drawFootballPitch, clearFootballPitch };
