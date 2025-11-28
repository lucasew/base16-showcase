import { paraglideMiddleware } from "$lib/paraglide/server.js"

export const handle = async ({ event, resolve }) => {
	return paraglideMiddleware(event.request, ({ request, locale }) => {
		return resolve(event)
	})
}
