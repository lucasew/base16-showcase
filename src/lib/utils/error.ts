import * as Sentry from '@sentry/sveltekit';

/**
 * Centralized error reporting function.
 * Logs errors to the console and reports to Sentry.
 *
 * @param error - The error object or message to report.
 * @param context - Additional context to help debug the issue.
 */
export function reportError(error: unknown, context?: Record<string, any>): void {
	const timestamp = new Date().toISOString();

	console.error('[Error Report]', {
		timestamp,
		error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
		context
	});

	if (context?.expected) {
		return;
	}

	Sentry.captureException(error, { extra: context });
}
