/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import Card from 'react-bootstrap/Card';
import {
  Nav, Tab, Form
} from 'react-bootstrap';
import { scaleLinear } from '@visx/scale';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import eventTypeIdMappings from './eventTypeIdMappings';

const STAT_TYPES = [{ name: 'Passes', key: 'passAccurate' }, { name: 'Shots', key: 'shotsTotal' }, { name: 'Ball Recoveries', key: 'ballRecovery' }];

const PASS_TYPES = [
  'passAccurate',
  'passChipped',
  'passCrossAccurate',
  'passLongballAccurate',
  'passThroughBallAccurate',
  'assist',
  'passKey',
  'bigChanceCreated',
];

const SHOT_TYPES = [
  'shotsTotal',
  'shotOnTarget',
  'shotOnPost',
  'shotOffTarget',
  'shotBlocked',
];

const BALL_RECOVERY_TYPES = [
  'clearanceTotal',
  'interceptionAll',
  'tackleWon',
  'duelAerialWon',
  'errorLeadsToGoal',
  'errorLeadsToShot',
  'outfielderBlock',
];

function getEventType(events, selection, teams, displayTeam) {
  const eventType = eventTypeIdMappings[selection];
  const filteredEvents = events.filter((event) => {
    if (displayTeam === "both" || (Number(event.teamId) === Number(teams[displayTeam])))
      return event.satisfiedEventsTypes.indexOf(eventType) !== -1;
  });
  return filteredEvents;
}

function calculateEventTotals(events, teams) {
  const totals = { home: {}, away: {} };
  events.forEach((event) => {
    const team = (Number(event.teamId) === Number(teams.home)) ? 'home' : 'away';
    event.satisfiedEventsTypes.forEach((typeId) => {
      if (typeId in totals[team]) {
        totals[team][typeId] += 1;
      } else {
        totals[team][typeId] = 1;
      }
    });
  });
  return totals;
}

function EventButton({
  name, keyString, home, away, onClick, classes
}) {
  return (
    <Card as="button"  onClick={onClick} className={classes}>
      <Card.Body>
        <Card.Title>
          {
              name
              || String(keyString)
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => { return str.toUpperCase(); })
            }
        </Card.Title>
        <Card.Text>
          {home}
          {' '}
          :
          {' '}
          {away}
        </Card.Text>
      </Card.Body>
    </Card>

  );
}

function EventPane({ statTypes, eventTotals, setSelection }) {
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {statTypes.map((type) => {
        const typeId = eventTypeIdMappings[type];
        return (
          <EventButton
            onClick={() => setSelection(type)}
            key={type}
            keyString={type}
            home={eventTotals.home[typeId] || 0}
            away={eventTotals.away[typeId] || 0}
          />
        );
      })}
    </div>
  );
}

function ChalkboardGraphics({
  width, height, data, teams,
}) {
  // process data for visx
  const events = data.map((event) => {
    const baseEvent = {
      startX: event.x,
      startY: event.y,
      isHome: Number(event.teamId) === Number(teams.home),

    };
    let extEvent = {};
    if (event.isShot === true) {
      extEvent = {
        endX: event.blockedX || 100,
        endY: event.blockedY || event.goalMouthY,
      };
    } else {
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

  // visx parameters
  const stroke = height / 100;
  const xScaleHome = useMemo(() => scaleLinear({
    domain: [0, 100],
    range: [stroke, width + stroke],
  }), [width, height]);

  const xScaleAway = useMemo(() => scaleLinear({
    domain: [0, 100],
    range: [width + stroke, stroke],
  }), [width, height]);

  const yScale = useMemo(() => scaleLinear({
    domain: [0, 100],
    range: [height, stroke * 2],
  }), [height]);

  const markerBox = useMemo(() => height / 60, [height]);
  return (
    <svg
      width={width + stroke * 2}
      height={height + stroke * 2}
      className="d-block mx-auto"
    >
      <defs>
        <marker
          id="arrow-home"
          markerUnits="strokeWidth"
          viewBox={`0 0 ${markerBox} ${markerBox}`}
          refX={markerBox / 2}
          refY={markerBox / 2}
          markerWidth={markerBox}
          markerHeight={markerBox}
          orient="auto"
        >
          <path
            fill="white"
            d={`M${markerBox / 6},${markerBox / 6} L${(markerBox * 5) / 6},${markerBox / 2} L${markerBox / 6},${(markerBox * 5) / 6} L${markerBox / 2},${markerBox / 2} L${markerBox / 6},${markerBox / 6}`}
          />
        </marker>
        <marker
          id="arrow-away"
          markerUnits="strokeWidth"
          viewBox={`0 0 ${markerBox} ${markerBox}`}
          refX={markerBox / 2}
          refY={markerBox / 2}
          markerWidth={markerBox}
          markerHeight={markerBox}
          orient="auto"
        >
          <path
            fill="black"
            d={`M${markerBox / 6},${markerBox / 6} L${(markerBox * 5) / 6},${markerBox / 2} L${markerBox / 6},${(markerBox * 5) / 6} L${markerBox / 2},${markerBox / 2} L${markerBox / 6},${markerBox / 6}`}
          />
        </marker>
      </defs>
      <FootballPitch
        key="chalkboard"
        width={width}
        height={height}
        stroke={stroke}
      />
      <Group transform={`translate(${0}, ${0})`}>
        {events.map((event) => (
          <Group>
            <circle
              r={width / 150}
              cx={event.isHome
                ? xScaleHome(event.startX)
                : xScaleAway(event.startX)}
              cy={yScale(event.startY)}
              fill={event.isHome ? 'white' : 'black'}
            />
            <line
              x1={event.endX
                ? event.isHome ? xScaleHome(event.startX) : xScaleAway(event.startX)
                : ''}
              y1={event.endY ? yScale(event.startY) : ''}
              x2={event.isHome ? xScaleHome(event.endX) : xScaleAway(event.endX)}
              y2={yScale(event.endY)}
              opacity={1}
              markerEnd={event.isHome ? 'url(#arrow-home)' : 'url(#arrow-away)'}
              stroke={event.isHome ? 'white' : 'black'}
              strokeWidth={stroke / 2}

            />
          </Group>
        ))}
      </Group>
    </svg>
  );
}

function Chalkboard({ events, teams }) {
  const [selection, setSelection] = useState('passAccurate');
  const [eventTotals, setEventTotals] = useState();
  const [isLoaded, setLoaded] = useState(false);
  const [displayTeam, setDisplayTeam] = useState("both")

  useEffect(() => {
    if (events) {
      setEventTotals(() => calculateEventTotals(events, teams));
      setLoaded(() => true);
    }
  }, [events, teams]);


  function handleTeamSelect (e) {
    setDisplayTeam(e.target.value)
  }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
       <Form>
        <div className="mb-3">
        <Form.Group >
          <Form.Check
            inline
            label="home"
            value="home"
            type="radio"
            onChange={handleTeamSelect}
            checked={displayTeam === "home"}
          />
          <Form.Check
            inline
            label="away"
            value="away"
            type="radio"
            onChange={handleTeamSelect}
            checked={displayTeam === "away"}
          />
          <Form.Check
            inline
            value="both"
            label="both"
            type="radio"
            onChange={handleTeamSelect}
            checked={displayTeam === "both"}
          />
          </Form.Group>
        </div>
   
    </Form>
      <div className="pitch-container">
        <ParentSize>
          {(parent) => (
            <ChalkboardGraphics
              width={0.9 * parent.width}
              height={0.9 * parent.height}
              data={getEventType(events, selection, teams, displayTeam)}
              teams={teams}
            />
          )}
        </ParentSize>
      </div>
      {isLoaded ? (
        <Tab.Container
          defaultActiveKey="passAccurate"
          onSelect={(k) => setSelection(k)}
        >
          <Nav className="justify-content-center p-3 mb-3 border-bottom border-secondary" direction="horizontal" gap={2}>
            {STAT_TYPES.map((type) => {
              const typeId = eventTypeIdMappings[type.key];
              return (
                <Nav.Item>
                  <Nav.Link eventKey={type.key}>
                    <EventButton
                      key={type.key}
                      keyString={type.key}
                      name={type.name}
                      home={eventTotals.home[typeId] || 0}
                      away={eventTotals.away[typeId] || 0}
                      classes="bg-primary text-secondary"
                    />
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="passAccurate">
              <EventPane
                statTypes={PASS_TYPES}
                eventTotals={eventTotals}
                setSelection={setSelection}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="shotsTotal">
              <EventPane
                statTypes={SHOT_TYPES}
                eventTotals={eventTotals}
                setSelection={setSelection}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="ballRecovery">
              <EventPane
                statTypes={BALL_RECOVERY_TYPES}
                eventTotals={eventTotals}
                setSelection={setSelection}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      ) : ''}
    </div>
  );
}

export default Chalkboard;
