/**
 * Centralized error reporting function.
 * Logs errors to the console and can be extended to report to Sentry or other services.
 *
 * @param error - The error object or message to report.
 * @param context - Additional context to help debug the issue.
 */
export function reportError(error: unknown, context?: Record<string, any>): void {
	const timestamp = new Date().toISOString();
	// In a production environment, this would send the error to an aggregation service.
	console.error('[Error Report]', {
		timestamp,
		error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
		context
	});
}
