import { useCallback } from 'react';
import { drawFootballPitch, clearFootballPitch } from './drawFootballPitch';

function FootballPitch() {
  const ref = useCallback((node) => {
    if (node !== null) {
      clearFootballPitch(node);
      drawFootballPitch(node);
    }
  }, []);

  return (
    <div className="pitch-container" data-testid="pitch-container" ref={ref} />
  );
}

export default FootballPitch;
