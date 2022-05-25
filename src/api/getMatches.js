export default async function getMatches() {
  const response = await fetch('/api/matches');
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
