/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Text } from '@visx/text';
import { ParentSize } from '@visx/responsive';
import { Form, Table } from 'react-bootstrap';

// const width = 1000;
// const height = 500;

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

function getPlayers(formations) {
  const currentPlayers = [];
  Object.entries(formations).forEach(([side, players]) => {
    const formation = players.formationPositions.map((position, index) => ({
      jerseyNumber: players.jerseyNumbers[index],
      playerId: players.playerIds[index],
      formationPosition: players.formationPositions[index] || null,
      isHome: side === 'home',
    }));
    currentPlayers.push(...formation);
  });
  return currentPlayers;
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

function Subs({ subs, setPlayer, playerIdDictionary }) {
  return (
    subs ? Object.entries(subs).map(([team, teamSubs]) => (
      <Table
        className={`text-secondary ${team === 'home' ? 'order-0' : 'order-3'}`}
        style={{ width: 'auto' }}
      >
        {
        teamSubs.map((sub) => (
          <tr
            className={`p-3 d-flex align-items-center ${team === 'home' ? '' : 'flex-row-reverse'}`}
            onClick={() => setPlayer({ isHome: team === 'home', id: sub.id })}
            role="button"
          >
            <td className="px-3 text-primary">{sub.jerseyNumber}</td>
            <td className="text-primary">{playerIdDictionary[sub.id]}</td>
          </tr>
        ))
      }
      </Table>
    )) : ''
  );
}

function FormationGraphics({
  width, height, players, setPlayer, playerIdDictionary,
}) {
  const xScaleHome = useMemo(() => scaleLinear({
    domain: [0, 10],
    range: [width / 30, width / 2],
  }), [width]);

  const xScaleAway = useMemo(() => scaleLinear({
    domain: [10, 0],
    range: [width / 2, width - width / 30],
  }), [width]);

  const yScale = useMemo(() => scaleLinear({
    domain: [0, 10],
    range: [height, height / 50],
  }), [height]);

  return (
    <svg
      width={width + height / 50}
      height={height + height / 50}
      className="d-block mx-auto"
    >
      <FootballPitch
        key="formations"
        width={width}
        height={height}
        stroke={height / 100}
      />
      <Group>
        {players.map((player, index) => (
          <Group
            onClick={() => setPlayer({ isHome: player.isHome, id: player.playerId })}
            role="button"
            transform={`translate(${height / 100}, ${-height / 50})`}
          >
            <circle
              r={width / 70}
              cx={player.isHome
                ? xScaleHome(player.formationPosition.vertical)
                : xScaleAway(player.formationPosition.vertical)}
              cy={yScale(player.formationPosition.horizontal)}
              fill={player.isHome ? 'white' : 'black'}
            />
            <Text
              dx={player.isHome
                ? xScaleHome(player.formationPosition.vertical)
                : xScaleAway(player.formationPosition.vertical)}
              dy={yScale(player.formationPosition.horizontal)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={player.isHome ? 'black' : 'white'}
            >
              {player.jerseyNumber}
            </Text>
            <Text
              dx={player.isHome
                ? xScaleHome(player.formationPosition.vertical)
                : xScaleAway(player.formationPosition.vertical)}
              dy={yScale(player.formationPosition.horizontal) + width / 70}
              textAnchor={player.isHome
                ? index === 0 ? 'start' : 'middle'
                : index === 11 ? 'end' : 'middle'}
              width={width / 20}
              verticalAnchor="start"
              className="formation-player"
            >
              {playerIdDictionary[player.playerId]}
            </Text>
          </Group>
        ))}
      </Group>
    </svg>
  );
}

function Formations({
  data, maxMinute, playerIdDictionary, setPlayer,
}) {
  const [squads] = useState({
    home: data.home[0],
    away: data.away[0],
  });
  const [formations, setFormations] = useState();
  const [players, setPlayers] = useState([]);
  const [subs, setSubs] = useState();
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    setFormations(() => getFormations(data, minute));
  }, [minute, data]);

  useEffect(() => {
    if (!formations) return;
    setPlayers(getPlayers(formations));
    setSubs({
      home: getSubs(squads.home, formations.home),
      away: getSubs(squads.away, formations.away),
    });
  }, [formations]);

  return (
    formations ? (
      <div className="d-flex justify-content-center align-items-center">
        <Subs
          subs={subs}
          setPlayer={setPlayer}
          playerIdDictionary={playerIdDictionary}
        />
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
          <div className="pitch-container">
            <ParentSize>
              {(parent) => (
                <FormationGraphics
                  width={0.9 * parent.width}
                  height={0.9 * parent.height}
                  players={players}
                  playerIdDictionary={playerIdDictionary}
                  setPlayer={setPlayer}
                />
              )}
            </ParentSize>
          </div>
        </div>

      </div>
    ) : ''
  );
}

export default Formations;
