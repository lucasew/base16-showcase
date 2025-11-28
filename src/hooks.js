// src/hooks.js
import { deLocalizeUrl } from "$lib/paraglide/runtime.js";

/** @type {import('@sveltejs/kit').Reroute} */
export const reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
