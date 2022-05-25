/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import getMatchEvents from 'api/getMatchEvents';
import FootballPitch from 'components/FootballPitch/FootballPitch';
import drawChalkboard from './drawChalkboard';

function Chalkboard({ id, teams }) {
  const [events, setEvents] = useState();
  const [selection, setSelection] = useState('Pass');
  const [data, setData] = useState();

  function getEventType(type) {
    return events.filter((event) => event.type.displayName === type);
  }

  useEffect(() => {
    getMatchEvents(id)
      .then((res) => {
        setEvents(() => res.events[0].events);
      });
  }, [id]);

  useEffect(() => {
    if (events) { setData(getEventType(selection)); }
  }, [events, selection]);

  useEffect(() => {
    if (data) { drawChalkboard(data, selection, teams); }
  }, [data]);

  return (
    <FootballPitch />
  );
}

export default Chalkboard;
