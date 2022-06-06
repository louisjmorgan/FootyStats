/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import getMatchEvents from 'api/getMatchEvents';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import Card from 'react-bootstrap/Card';
import {
  Nav, Tab,
} from 'react-bootstrap';
import drawChalkboard from './drawChalkboard';

const STAT_TYPES = ['Pass', 'Shots', 'BallRecovery'];

const PASS_TYPES = ['Chipped', 'Cross', 'HeadPass', 'KeyPass', 'Longball', 'ShotAssist', 'Throughball', 'ThrowIn'];

const SHOT_TYPES = ['MissedShots', 'ShotOnPost', 'SavedShot', 'Goal'];

const BALL_RECOVERY_TYPES = ['Clearance', 'Interception', ['Tackle', 'Total']];

function getEventType(events, selection) {
  const filteredEvents = events.filter((event) => event.type.displayName === selection.type);
  console.log(filteredEvents);
  if (selection.subType === 'All') { return filteredEvents; }
  return filteredEvents.filter((event) => {
    return event.qualifiers.reduce((prev, qualifier) => {
      return (qualifier.type.displayName === selection.subType) || prev;
    }, false);
  });
}

function calculateEventTotals(events, teams) {
  const totals = { home: {}, away: {} };
  events.forEach((event) => {
    const team = (Number(event.teamId) === Number(teams.home)) ? 'home' : 'away';
    const statName = event.type.displayName;
    if (statName in totals[team]) {
      totals[team][statName].Total += 1;
    } else {
      totals[team][statName] = { Total: 1 };
    }
    event.qualifiers.forEach((qualifier) => {
      const subStatName = qualifier.type.displayName;
      if (subStatName in totals[team][statName]) {
        if (qualifier.value) {
          totals[team][statName][subStatName] += Number(qualifier.value);
        } else totals[team][statName][subStatName] += 1;
      } else {
        totals[team][statName][subStatName] = 1;
      }
    });
  });
  (['home', 'away']).forEach((team) => {
    totals[team].Shots = { Total: 0 };
    SHOT_TYPES.forEach((type) => {
      totals[team].Shots.Total += totals[team][type] ? totals[team][type].Total : 0;
    });
  });
  console.log(totals);
  return totals;
}

function EventButton({ type, home, away }) {
  return (
    <Card as="button">
      <Card.Body>
        <Card.Title>{type}</Card.Title>
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

function Chalkboard({ id, teams }) {
  const [events, setEvents] = useState();
  const [selection, setSelection] = useState({ type: 'Pass', subType: 'All' });
  const [eventTotals, setEventTotals] = useState();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    getMatchEvents(id)
      .then((res) => {
        setEvents(() => res.events[0].events);
      });
  }, [id]);

  useEffect(() => {
    if (events) {
      setEventTotals(() => calculateEventTotals(events, teams));
      setLoaded(() => true);
      console.log(events);
    }
  }, [events, teams]);

  useEffect(() => {
    if (events) { drawChalkboard(getEventType(events, selection), selection, teams); }
  }, [events, selection]);
  return (
    <>
      <FootballPitch instance="chalkboard" />
      {isLoaded ? (
        <Tab.Container
          activeKey={selection.type}
          onSelect={(k) => setSelection({ type: k, subType: 'All' })}
        >
          <Nav className="justify-content-center" direction="horizontal" gap={2}>
            {STAT_TYPES.map((type) => (
              <Nav.Item>
                <Nav.Link eventKey={type}>
                  <EventButton
                    key={type}
                    type={type}
                    home={eventTotals.home[type].Total}
                    away={eventTotals.away[type].Total}
                  />
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="Pass">
              {PASS_TYPES.map((type) => {
                console.log(type);
                if (eventTotals.home.Pass[type]) {
                  return (
                    <EventButton
                      onClick={() => setSelection({ ...selection, subType: type })}
                      key={type}
                      type={type}
                      home={eventTotals.home.Pass[type]}
                      away={eventTotals.away.Pass[type]}
                    />

                  );
                }
              })}
            </Tab.Pane>
            <Tab.Pane eventKey="Shots">
              {SHOT_TYPES.map((type) => {
                if (eventTotals.home[type]) {
                  return (
                    <EventButton
                      key={type}
                      type={type}
                      home={eventTotals.home[type].Total}
                      away={eventTotals.away[type].Total}
                    />

                  );
                }
              })}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      ) : ''}
    </>

  );
}

export default Chalkboard;
