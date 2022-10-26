import {api } from "api";
export default async function getMatches(id) {
  console.log(api)
  const response = await fetch(`${api}/matches/${id}/events`, { 
    method: "GET", 
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
  },
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
