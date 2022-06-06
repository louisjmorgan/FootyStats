import * as d3 from 'd3';

const WIDTH = 1000;
const HEIGHT = 500;
const STROKE_WIDTH = 5;

export default function drawFormations(data, playerIdDictionary, setPlayer) {
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

  const pitch = d3.select('.formations');

  // scale coordinates to pitch size
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
  group.append('text')
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
