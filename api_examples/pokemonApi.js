import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/pokedex/";

export function getPokemons() {
  console.log("Fetching pokemons from:", baseUrl);
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}