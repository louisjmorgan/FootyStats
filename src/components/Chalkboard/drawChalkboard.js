import * as d3 from 'd3';

const WIDTH = 1000;
const HEIGHT = 500;
const STROKE_WIDTH = 5;

export default function drawChalkboard(data, selection, teams) {
  const events = data.map((event) => {
    const baseEvent = {
      startX: event.x,
      startY: event.y,
      isHome: Number(event.teamId) === Number(teams.home),
    };
    let extEvent = {};
    if (selection.type === 'Pass') {
      extEvent = {
        endX: event.endX,
        endY: event.endY,
      };
    }
    return {
      ...baseEvent,
      ...extEvent,
    };
  });

  // scales coordinates to pitch size
  const xScaleHome = d3.scaleLinear().domain([0, 100]).range([0, WIDTH]);
  const xScaleAway = d3.scaleLinear().domain([0, 100]).range([WIDTH, 0]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([HEIGHT, STROKE_WIDTH * 2]);

  const pitch = d3.select('.chalkboard');

  const markerBox = 8;
  pitch.append('defs')
    .append('marker')
    .attr('id', 'arrow-home')
    .attr('markerUnits', 'strokeWidth')
    .attr('viewBox', `0 0 ${markerBox} ${markerBox}`)
    .attr('refX', markerBox / 2)
    .attr('refY', markerBox / 2)
    .attr('markerWidth', markerBox)
    .attr('markerHeight', markerBox)
    .attr('orient', 'auto')
    .append('path')
    .style('fill', 'red')
    .attr('d', `M${markerBox / 6},${markerBox / 6} L${(markerBox * 5) / 6},${markerBox / 2} L${markerBox / 6},${(markerBox * 5) / 6} L${markerBox / 2},${markerBox / 2} L${markerBox / 6},${markerBox / 6}`);

  pitch.append('defs')
    .append('marker')
    .attr('id', 'arrow-away')
    .attr('markerUnits', 'strokeWidth')
    .attr('viewBox', `0 0 ${markerBox} ${markerBox}`)
    .attr('refX', markerBox / 2)
    .attr('refY', markerBox / 2)
    .attr('markerWidth', markerBox)
    .attr('markerHeight', markerBox)
    .attr('orient', 'auto')
    .append('path')
    .style('fill', 'blue')
    .attr('d', `M${markerBox / 6},${markerBox / 6} L${(markerBox * 5) / 6},${markerBox / 2} L${markerBox / 6},${(markerBox * 5) / 6} L${markerBox / 2},${markerBox / 2} L${markerBox / 6},${markerBox / 6}`);

  pitch.selectAll('g').remove();
  const dots = pitch.selectAll('g').data(events);
  const group = dots.enter().append('g');

  // add circles
  group.append('circle')
    .attr('r', WIDTH / 150)
    .attr('cx', (d) => (d.isHome ? xScaleHome(d.startX) : xScaleAway(d.startX)))
    .attr('cy', (d) => yScale(d.startY))
    .style('fill', (d) => (d.isHome ? 'red' : 'blue'));

  group.append('line')
    .attr('x1', (d) => (d.isHome ? xScaleHome(d.startX) : xScaleAway(d.startX)))
    .attr('y1', (d) => yScale(d.startY))
    .attr('x2', (d) => (d.isHome ? xScaleHome(d.endX) : xScaleAway(d.endX)))
    .attr('y2', (d) => yScale(d.endY))
    .style('stroke-width', 3)
    .style('opacity', 1)
    .attr('marker-end', (d) => (d.isHome ? 'url(#arrow-home)' : 'url(#arrow-away)'))
    .style('stroke', (d) => (d.isHome ? 'red' : 'blue'));
}
