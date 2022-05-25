import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Formations, MatchPlayer } from 'components';
import { getMatch } from 'api';
import Chalkboard from 'components/Chalkboard/Chalkboard';

export default function Match() {
  const { id } = useParams();
  const [match, setMatch] = useState();
  const [title, setTitle] = useState();
  const [player, setPlayer] = useState();

  const handlePlayer = (selection) => {
    const { players } = match[selection.isHome ? 'home' : 'away'];
    const newPlayer = players.filter((p) => p.playerId === selection.id);
    setPlayer(newPlayer[0]);
  };

  // logic
  const [tabKey, setTabKey] = useState('formations');
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    getMatch(id)
      .then((res) => {
        setMatch(() => res.match);
        setTitle(() => `${res.match.home.name} ${res.match.ftScore} ${res.match.away.name}`);
      })
      .then(() => setLoaded(() => true));
  }, [id]);

  return (
    <div>
      <h1 className="p-5 text-center">{title}</h1>

      {isLoaded
        ? (
          <Tabs
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="m-5"
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
              />
              {player
                ? <MatchPlayer data={player} />
                : ''}
            </Tab>
            <Tab eventKey="chalkboard" title="Chalkboard">
              <Chalkboard id={id} teams={{ home: match.home.teamId, away: match.away.teamId }} />
            </Tab>

          </Tabs>
        )

        : ''}
    </div>
  );
}
