import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Formations, Chalkboard, Heatmaps } from 'components';
import { getMatch, getMatchEvents } from 'api';

export default function Match() {
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [match, setMatch] = useState();
  const [events, setEvents] = useState();

  const [player, setPlayer] = useState();
  const handlePlayer = (selection) => {
    const { players } = match[selection.isHome ? 'home' : 'away'];
    const newPlayer = players.filter((p) => p.playerId === selection.id);
    setPlayer(newPlayer[0]);
  };

  // logic
  const [tabKey, setTabKey] = useState('formations');

  useEffect(() => {
    getMatch(id)
      .then((res) => {
        setMatch(() => res.match);
        setTitle(() => `${res.match.home.name} ${res.match.ftScore} ${res.match.away.name}`);
      });
    getMatchEvents(id)
      .then((res) => {
        setEvents(() => res.events[0].events);
      });
  }, [id]);

  return (
    <main className="mb-5">
      <h1 className="p-5 text-center text-primary match-heading bg-secondary">{title}</h1>
      {(match && events)
        ? (
          <Tabs
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="mb-3 justify-content-center text-black"
            mountOnEnter
          >
            <Tab eventKey="formations" title="Formations">
              <Formations
                data={{
                  home: match.home.formations,
                  away: match.away.formations,
                }}
                maxMinute={match.maxMinute}
                playerIdDictionary={match.playerIdNameDictionary}
                setPlayer={handlePlayer}
                player={player}
                className="bg-secondary"
              />
            </Tab>
            <Tab eventKey="chalkboard" title="Chalkboard">
              <Chalkboard
                events={events}
                teams={{ home: match.home.teamId, away: match.away.teamId }}
                className="bg-secondary"
              />
            </Tab>
            <Tab eventKey="heatmaps" title="Heatmaps" unmountOnExit>
              <Heatmaps
                players={{
                  home: match.home.formations[0].playerIds,
                  away: match.away.formations[0].playerIds,
                }}
                playerIdDictionary={match.playerIdNameDictionary}
                events={events}
                className="bg-secondary"
              />
            </Tab>
          </Tabs>
        )

        : ''}
    </main>
  );
}
