export default async function getMatches(id) {
  const response = await fetch(`/api/matches/${id}/events`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
