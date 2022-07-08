/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// import { drawFootballPitch, clearFootballPitch } from 'graphics/FootballPitch/FootballPitch';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import { Form, Table } from 'react-bootstrap';
import drawFormations from './drawFormations';

function getFormations(data, minute) {
  const newFormations = {};
  Object.entries(data).forEach(([team, formationData]) => {
    const newFormation = formationData.filter((formation) => (
      minute >= formation.startMinuteExpanded
        && minute <= formation.endMinuteExpanded
    ));
    [newFormations[team]] = newFormation;
  });
  return newFormations;
}

function getSubs(squad, formation) {
  const subs = [];
  squad.playerIds.forEach((player, index) => {
    const isSub = formation.playerIds.slice(0, 11).indexOf(player);
    if (isSub === -1) {
      subs.push({
        id: player,
        jerseyNumber: squad.jerseyNumbers[index],
      });
    }
  });
  return subs;
}

function Formations({
  data, maxMinute, playerIdDictionary, setPlayer,
}) {
  const [formations, setFormations] = useState();

  const [squads] = useState({
    home: data.home[0],
    away: data.away[0],
  });

  const [subs, setSubs] = useState();

  const [minute, setMinute] = useState(0);

  useEffect(() => {
    setFormations(() => getFormations(data, minute));
  }, [minute, data]);

  useEffect(() => {
    if (!formations) return;
    drawFormations(formations, playerIdDictionary, setPlayer);
  }, [formations, playerIdDictionary]);

  useEffect(() => {
    if (!formations) return;
    setSubs({
      home: getSubs(squads.home, formations.home),
      away: getSubs(squads.away, formations.away),
    });
  }, [formations]);

  return (
    <div className="d-flex">
      {subs
        ? Object.entries(subs).map(([team, teamSubs]) => (
          <Table hover className={team === 'home' ? 'order-0' : 'order-3'}>
            {
            teamSubs.map((sub) => (
              <tr>
                <td>{sub.jerseyNumber}</td>
                <td>{playerIdDictionary[sub.id]}</td>
              </tr>
            ))
          }
          </Table>
        )) : ''}
      <div>
        <Form.Label className="d-block w-50 p-3 mx-auto">
          Minute:
          {' '}
          {minute}
          <Form.Range
            min={0}
            max={maxMinute}
            step={1}
            onChange={(e) => setMinute(Number(e.target.value))}
            value={minute}
          />
        </Form.Label>
        {/* <div className="pitch-container" data-testid="pitch-container" ref={ref} /> */}
        <FootballPitch instance="formations" />
      </div>

    </div>
  );
}

export default Formations;
