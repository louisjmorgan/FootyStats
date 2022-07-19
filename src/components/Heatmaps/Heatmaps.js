/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import FootballPitch from 'components/FootballPitch/FootballPitch';
import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { Form } from 'react-bootstrap';
import { ParentSize } from '@visx/responsive';
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
  const ref = useCallback((node) => {
    if (!node) return;
    heatmap.current = h337.create({
      container: node,
      radius: 50,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.7,
    });
    heatmap.current.setData({
      data: getNetTouches(touches[selectedTeam], selectedPlayers[selectedTeam]),
    });
  }, []);

  useEffect(() => (() => heatmap.current._renderer.canvas.remove()), []);

  useEffect(() => {
    if (!touches || !heatmap.current) return;
    heatmap.current.setData({
      data: getNetTouches(touches[selectedTeam], selectedPlayers[selectedTeam]),
    });
  }, [heatmap.current, touches, selectedPlayers, selectedTeam]);

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
    if (selectedPlayers[selectedTeam].length === players[selectedTeam].length) {
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
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Form>
        <div className="mb-3">
          <Form.Group>
            <Form.Check
              inline
              label="home"
              value="home"
              type="radio"
              onChange={(e) => setSelectedTeam(e.target.value)}
              checked={selectedTeam === 'home'}
            />
            <Form.Check
              inline
              label="away"
              value="away"
              type="radio"
              onChange={(e) => setSelectedTeam(e.target.value)}
              checked={selectedTeam === 'away'}
            />
          </Form.Group>
        </div>

      </Form>
      {/* <Tabs
          id="controlled-tab-example"
          activeKey={selectedTeam}
          onSelect={(k) => setSelectedTeam(k)}
          className="mb-3 justify-content-center"
        >
          <Tab eventKey="home" title="Home" />
          <Tab eventKey="away" title="Away" />
        </Tabs> */}
      <div
        className="pitch-container"
      >
        <ParentSize>
          {(parent) => {
            const height = 0.9 * parent.height;
            const width = 0.9 * parent.width;
            const stroke = height / 100;
            return (
              width ? (
                <>
                  <svg
                    width={width + stroke * 2}
                    height={height + stroke * 2}
                    style={{
                      position: 'absolute',
                      zIndex: 100,
                      margin: '0 auto',
                      left: 0,
                      right: 0,
                    }}
                  >
                    <FootballPitch
                      key="heatmaps"
                      width={width}
                      height={height}
                      stroke={stroke}
                    />
                  </svg>
                  <div
                    ref={ref}
                    style={{
                      position: 'absolute',
                      height: `${height - stroke}px`,
                      width: `${width - stroke}px`,
                      zIndex: 100,
                      margin: '0 auto',
                      top: `${stroke * 1.5}5px`,
                    }}
                  />
                </>
              ) : ''
            );
          }}
        </ParentSize>

      </div>
      <Form className="w-50 p-3 mx-auto d-flex flex-column align-items-center">
        <Form.Check type="checkbox" label="Select All" checked={selectedPlayers[selectedTeam].length === players[selectedTeam].length} onClick={() => handleSelectAll()} />
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
