export default async function getMatch(id) {
  const response = await fetch(`/api/matches/${id}`);
  const body = response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
}
