/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { drawFootballPitch, clearFootballPitch } from './drawFootballPitch';

function FootballPitch({ instance }) {
  const ref = useCallback((node) => {
    if (node !== null) {
      clearFootballPitch(node);
      drawFootballPitch(node, instance);
    }
  }, [instance]);

  return (
    <div className="pitch-container" data-testid="pitch-container" ref={ref} key={instance} />
  );
}

export default FootballPitch;
