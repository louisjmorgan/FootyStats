/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import Card from 'react-bootstrap/Card';
import {
  Nav, Tab,
} from 'react-bootstrap';
import drawChalkboard from './drawChalkboard';
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

function getEventType(events, selection) {
  const eventType = eventTypeIdMappings[selection];
  const filteredEvents = events.filter((event) => {
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
  name, keyString, home, away, onClick,
}) {
  return (
    <Card as="button" onClick={onClick}>
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

function Chalkboard({ events, teams }) {
  const [selection, setSelection] = useState('passAccurate');
  const [eventTotals, setEventTotals] = useState();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (events) {
      setEventTotals(() => calculateEventTotals(events, teams));
      setLoaded(() => true);
    }
  }, [events, teams]);

  useEffect(() => {
    if (events) { drawChalkboard(getEventType(events, selection), teams); }
  }, [events, selection]);

  return (
    <>
      <FootballPitch instance="chalkboard" />
      {isLoaded ? (
        <Tab.Container
          defaultActiveKey="passAccurate"
          onSelect={(k) => setSelection(k)}
        >
          <Nav className="justify-content-center" direction="horizontal" gap={2}>
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
    </>

  );
}

export default Chalkboard;
