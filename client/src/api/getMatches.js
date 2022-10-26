import { api } from 'api';

export default async function getMatches() {
  const response = await fetch(`${api}/matches`, {
    method: 'GET',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
