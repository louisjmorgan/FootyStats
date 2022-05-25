/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// import { drawFootballPitch, clearFootballPitch } from 'graphics/FootballPitch/FootballPitch';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import { Form } from 'react-bootstrap';
import drawFormations from './drawFormations';

function Formations({
  data, maxMinute, playerIdDictionary, setPlayer,
}) {
  const [formations, setFormations] = useState({
    home: data.home[0],
    away: data.away[0],
  });

  const [minute, setMinute] = useState(0);

  useEffect(() => {
    const newFormations = {};
    Object.entries(data).forEach(([team, formationData]) => {
      const newFormation = formationData.filter((formation) => (
        minute >= formation.startMinuteExpanded
        && minute <= formation.endMinuteExpanded
      ));
      [newFormations[team]] = newFormation;
    });
    setFormations(() => newFormations);
  }, [minute, data]);

  // const ref = useCallback((node) => {
  //   if (node !== null) {
  //     clearFootballPitch(node);
  //     drawFootballPitch(node);
  //   }
  // }, []);

  useEffect(() => {
    drawFormations(formations, playerIdDictionary, setPlayer);
  }, [formations, playerIdDictionary]);

  return (
    <>
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
      <FootballPitch />
    </>
  );
}

export default Formations;
