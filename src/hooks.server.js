import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
// src/hooks.server.js
import { paraglideMiddleware } from '$lib/paraglide/server.js';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(Sentry.sentryHandle(), ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	}));
export const handleError = Sentry.handleErrorWithSentry();