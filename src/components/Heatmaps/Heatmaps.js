/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import FootballPitch from 'components/FootballPitch/FootballPitch';
import {
  useEffect, useRef, useState,
} from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import h337 from 'heatmap.js';

function getPlayerTouches(players, events) {
  const touches = { home: [], away: [] };
  Object.entries(players).forEach(([team, teamPlayers]) => {
    teamPlayers.forEach((player) => {
      const filteredEvents = events.filter((event) => event.isTouch && event.playerId === player);
      touches[team][player] = filteredEvents.map((event) => ({
        x: event.x * 10,
        y: (100 - event.y) * 5,
      }));
    });
  });
  return touches;
}

function getNetTouches(touches, selectedPlayers) {
  const netTouches = [];
  touches.forEach((playerTouches, player) => {
    if (selectedPlayers.indexOf(player) !== -1) { netTouches.push(...playerTouches); }
  });
  return netTouches;
}

function Heatmaps({ players, playerIdDictionary, events }) {
  const [selectedPlayers, setSelectedPlayers] = useState(players);
  const [selectedTeam, setSelectedTeam] = useState('home');
  const [touches] = useState(getPlayerTouches(players, events));
  const heatmap = useRef();

  useEffect(() => {
    heatmap.current = h337.create({
      container: document.getElementById('heatmaps'),
      radius: 50,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.7,
    });
    return (() => heatmap.current._renderer.canvas.remove());
  }, []);

  useEffect(() => {
    if (!touches) return;
    heatmap.current.setData({
      data: getNetTouches(touches[selectedTeam], selectedPlayers[selectedTeam]),
    });
  }, [touches, selectedPlayers, selectedTeam]);

  function handleSelectPlayer(player) {
    const index = selectedPlayers[selectedTeam].indexOf(player);
    if (index === -1) {
      setSelectedPlayers((prev) => ({
        ...prev,
        [selectedTeam]: [...prev[selectedTeam], player],
      }));
    } else {
      setSelectedPlayers((prev) => ({
        ...prev,
        [selectedTeam]: prev[selectedTeam].filter((p, i) => i !== index),
      }));
    }
  }

  function handleSelectAll() {
    if (selectedPlayers[selectedTeam].length === 20) {
      setSelectedPlayers((prev) => ({
        ...prev,
        [selectedTeam]: [],
      }));
    } else {
      setSelectedPlayers((prev) => ({
        ...prev,
        [selectedTeam]: [...players[selectedTeam]],
      }));
    }
  }

  return (
    <div
      style={{
        height: '500px', width: '1000px', position: 'relative', margin: '0 auto',
      }}
    >
      <Tabs
        id="controlled-tab-example"
        activeKey={selectedTeam}
        onSelect={(k) => setSelectedTeam(k)}
        className="mb-3 justify-content-center"
      >
        <Tab eventKey="home" title="Home" />
        <Tab eventKey="away" title="Away" />
      </Tabs>
      <div style={{
        height: '100%',
        width: '100%',
        zIndex: 1,
        position: 'absolute',

      }}
      >
        <FootballPitch
          instance="heatmaps"
        />
      </div>
      <div
        id="heatmaps"
        style={{
          height: '99%',
          width: '99.5%',
          zIndex: 100,
          top: '5px',
          left: '5px',

        }}
      />
      <Form className="w-50 p-3 mx-auto d-flex flex-column align-items-center">
        <Form.Check type="checkbox" label="Select All" checked={selectedPlayers[selectedTeam].length === 20} onClick={() => handleSelectAll()} />
        {players[selectedTeam].map((player) => (
          <Form.Check
            type="checkbox"
            label={playerIdDictionary[player]}
            checked={selectedPlayers[selectedTeam].indexOf(player) !== -1}
            onClick={() => handleSelectPlayer(player)}
          />
        ))}
      </Form>
    </div>
  );
}

export default Heatmaps;
