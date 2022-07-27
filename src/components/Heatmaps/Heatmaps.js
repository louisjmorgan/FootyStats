/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import FootballPitch from 'components/FootballPitch/FootballPitch';
import {
  useEffect, useState,
} from 'react';
import { Form } from 'react-bootstrap';
import { ParentSize } from '@visx/responsive';
import * as d3 from 'd3';

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

function HeatmapGraphics({
  data, width, height, stroke,
}) {
  useEffect(() => {
    if (!(width && height && data)) return;

    const container = d3.select('.heatmaps');
    // const xScale = d3.scaleLinear().domain([0, 500]).range([0, width]);
    // const yScale = d3.scaleLinear().domain([0, 500]).range([height, stroke * 2]);
    const xScale = d3.scaleLinear().domain([0, 500]).range([0, 1000]);
    const yScale = d3.scaleLinear().domain([0, 500]).range([500, 10]);

    const colorMax = 0.0075;
    const opacity = 0.4;
    const colorScale = d3.scaleLinear()
      .domain([
        0, 0.25 * colorMax,
        0.5 * colorMax,
        0.75 * colorMax,
        colorMax,
      ]) // Points per square pixel.
      .range([
        `rgba(0,0,255, ${opacity})`,
        `rgba(0,255,0, ${opacity})`,
        `rgba(0,255,255, ${opacity})`,
        `rgba(255,255,0, ${opacity})`,
        `rgba(255,0,0, ${opacity})`,
      ]);

    const densityData = d3.contourDensity()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .size([1000, 500])
      .weight(10)
      .bandwidth(18)(data);

    container.selectAll('path').remove();
    const heatmap = container.selectAll('path').data(densityData);
    heatmap
      .enter()
      .append('path')
      .attr('d', d3.geoPath())
      .attr('fill', (d) => colorScale(d.value))
      .attr('transform', `scale(${width / 1000})`);
  }, [width, height, data]);

  return (
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
      <svg
        className="heatmaps"
        style={{
          position: 'absolute',
          height: `${height - stroke}px`,
          width: `${width - stroke}px`,
          // height: '100%',
          // width: '100%',
          zIndex: 100,
          margin: '0 auto',
          top: `${stroke * 1.5}5px`,
          left: 0,
          right: 0,
        }}
      />
    </>
  );
}

function Heatmaps({ players, playerIdDictionary, events }) {
  const [selectedPlayers, setSelectedPlayers] = useState(players);
  const [selectedTeam, setSelectedTeam] = useState('home');
  const [touches] = useState(getPlayerTouches(players, events));
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!touches) return;
    setData(() => getNetTouches(touches[selectedTeam], selectedPlayers[selectedTeam]));
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
      <div
        className="pitch-container"
      >
        <ParentSize>
          {(parent) => {
            const height = 0.9 * parent.height;
            const width = 0.9 * parent.width;
            const stroke = height / 100;
            return (
              <HeatmapGraphics data={data} width={width} height={height} stroke={stroke} />
            );
          }}
        </ParentSize>
      </div>
      <Form className="w-50 p-3 mx-auto d-flex flex-column align-items-center">
        <Form.Check type="checkbox" label="Select All" checked={selectedPlayers[selectedTeam].length === players[selectedTeam].length} onChange={() => handleSelectAll()} />
        {players[selectedTeam].map((player) => (
          <Form.Check
            type="checkbox"
            key={player}
            label={playerIdDictionary[player]}
            checked={selectedPlayers[selectedTeam].indexOf(player) !== -1}
            onChange={() => handleSelectPlayer(player)}
          />
        ))}
      </Form>
    </div>
  );
}

export default Heatmaps;
