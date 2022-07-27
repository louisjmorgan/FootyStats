/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Container, Stack, Form,
} from 'react-bootstrap';
import { getMatches } from 'api';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getMatches().then((res) => {
      setMatches(() => res.matches);
      setFilteredMatches(() => res.matches);
    });
  }, []);

  useEffect(() => {
    setTeams(() => matches.reduce((prev, match) => {
      if (prev.indexOf(match.home.name) === -1) {
        prev.push(match.home.name);
      }
      return prev;
    }, []));
  }, [matches]);

  function handleSelectTeam(team) {
    if (team === 'all') {
      setFilteredMatches(() => matches);
      return;
    }
    setFilteredMatches(() => matches.filter((match) => {
      if (match.home.name === team || match.away.name === team) return true;
      return false;
    }));
  }

  return (
    <Container fluid className="App">
      <h1 className="p-5 text-center text-secondary">Footy Stats</h1>

      <Container fluid className="match-buttons  min-vh-50 p-5">
        <Form.Label className="w-100 d-flex flex-column justify-content-center mx-auto m-5 text-center">
          Select Team:
          <Form.Select className="w-25 mx-auto" onChange={(e) => handleSelectTeam(e.target.value)}>
            <option value="all">All</option>
            {
              teams.sort().map((team) => (
                <option key={team} value={team}>{team}</option>
              ))
            }
          </Form.Select>
        </Form.Label>
        <Stack className="w-75 mx-auto d-flex flex-wrap justify-content-center" direction="horizontal" gap={2}>
          {filteredMatches.map((match) => (
            <Link key={match._id} to={`/matches/${match._id}`}>
              <Button variant="outline-primary" className="border-2">
                {match.home.name}
                {' '}
                {match.ftScore}
                {' '}
                {match.away.name}
              </Button>
            </Link>
          ))}
        </Stack>
      </Container>
    </Container>
  );
}
