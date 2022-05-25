import * as d3 from 'd3';

const WIDTH = 1000;
const HEIGHT = 500;
const STROKE_WIDTH = 5;

function drawFormations(data, playerIdDictionary, setPlayer) {
  const formations = [];
  Object.entries(data).forEach(([side, players]) => {
    const formation = players.formationPositions.map((position, index) => ({
      jerseyNumber: players.jerseyNumbers[index],
      playerId: players.playerIds[index],
      formationPosition: players.formationPositions[index] || null,
      isHome: side === 'home',
    }));
    formations.push(...formation);
  });

  const pitch = d3.select('.pitch');

  // add teams to pitch
  const xScaleHome = d3.scaleLinear().domain([0, 10]).range([WIDTH / 30, WIDTH / 2]);
  const yScale = d3.scaleLinear().domain([0, 10]).range([HEIGHT, 0]);
  const xScaleAway = d3.scaleLinear().domain([10, 0]).range([WIDTH / 2, (WIDTH * 29) / 30]);

  pitch.selectAll('g').remove();
  const dots = pitch.selectAll('g').data(formations);
  const group = dots.enter()
    .append('g')
    .on('click', (e, d) => {
      setPlayer({ isHome: d.isHome, id: d.playerId });
    });

  // add circles
  group.append('circle')
    .attr('r', WIDTH / 70)
    .attr('cx', (d) => (d.isHome
      ? xScaleHome(d.formationPosition.vertical)
      : xScaleAway(d.formationPosition.vertical)))
    .attr('cy', (d) => yScale(d.formationPosition.horizontal))
    .style('fill', (d) => (d.isHome ? 'red' : 'blue'));

  // add jersey numbers
  group.enter().append('text')
    .attr('dx', (d) => (d.isHome
      ? xScaleHome(d.formationPosition.vertical)
      : xScaleAway(d.formationPosition.vertical)))
    .attr('dy', (d) => yScale(d.formationPosition.horizontal))
    .text((d) => `${d.jerseyNumber}`)
    .attr('startOffset', '50%')
    .style('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('fill', 'white');

  // add names
  group.append('text')
    .attr('dx', (d) => (d.isHome
      ? xScaleHome(d.formationPosition.vertical)
      : xScaleAway(d.formationPosition.vertical)))
    .attr('dy', (d) => yScale(d.formationPosition.horizontal) + WIDTH / 40)
    .text((d) => `${playerIdDictionary[d.playerId]}`)
    .attr('startOffset', '100%')
    .style('text-anchor', (d, i) => {
      if (d.isHome) {
        if (i === 0) return 'start';
        return 'middle';
      }
      if (i === 11) return 'end';
      return 'middle';
    })
    .style('fill', 'white')
    .style('font-weight', 'semibold')
    .style('font-family', 'sans-serif')
    .style('font-size', '0.75em');

  // stroke width offset
  group.selectAll('circle').attr('transform', `translate(${STROKE_WIDTH}, ${STROKE_WIDTH})`);
  group.selectAll('text').attr('transform', `translate(${STROKE_WIDTH}, ${STROKE_WIDTH})`);
}

function drawFootballPitch(ref) {
  // let container;
  // if (ref) container = d3.select(ref);
  // else container = d3.select('.pitch-container');

  const container = (ref ? d3.select(ref) : d3.select('.pitch-container'))// select the pitch element
    .append('svg') // append an SVG element to the body
    .attr('width', WIDTH + STROKE_WIDTH * 2)
    .attr('height', HEIGHT + STROKE_WIDTH * 2)
    .style('display', 'block')
    .classed('pitch', true)
    .classed('mx-auto', true);

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

export { drawFootballPitch, clearFootballPitch, drawFormations };
