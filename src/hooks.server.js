// src/hooks.server.js
import { paraglideMiddleware } from "$lib/paraglide/server.js";

/** @type {import('@sveltejs/kit').Handle} */
export const handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request: localizedRequest, locale }) => {
      event.request = localizedRequest;
      return resolve(event, {
        transformPageChunk: ({ html }) =>
          html.replace("%paraglide.lang%", locale),
      });
    },
  );
