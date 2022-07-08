/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Stack } from 'react-bootstrap';
import { getMatches } from 'api';

export default function Home() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getMatches().then((res) => setMatches(() => res.matches));
  }, []);

  const links = matches.map((match) => (
    <Link key={match._id} to={`/matches/${match._id}`}>
      <Button variant="outline-primary" className="border-2">
        {match.home.name}
        {' '}
        {match.ftScore}
        {' '}
        {match.away.name}
      </Button>
    </Link>
  ));

  return (
    <Container fluid className="App">
      <h1 className="p-5 text-center text-secondary">Footy Stats</h1>
      <Container fluid className="match-buttons">
        <Stack className="w-75 mx-auto d-flex flex-wrap justify-content-center" direction="horizontal" gap={2}>
          {links}
        </Stack>
      </Container>
    </Container>
  );
}
