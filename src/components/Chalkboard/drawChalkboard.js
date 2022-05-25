import * as d3 from 'd3';

const WIDTH = 1000;
const HEIGHT = 500;
const STROKE_WIDTH = 5;

export default function drawChalkboard(data, selection, teams) {
  const events = data.map((event) => {
    const baseEvent = {
      startX: event.x,
      startY: event.y,
      isHome: event.teamId === teams.home,
    };
    let extEvent = {};
    if (selection === 'Pass') {
      extEvent = {
        endX: Number(event.qualifiers.filter((qualifier) => qualifier.type.displayName === 'PassEndX')[0].value),
        endY: Number(event.qualifiers.filter((qualifier) => qualifier.type.displayName === 'PassEndY')[0].value),
      };
    }
    return {
      ...baseEvent,
      ...extEvent,
    };
  });

  console.log(events);
}
