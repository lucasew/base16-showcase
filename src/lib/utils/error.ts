/**
 * Centralized error reporting function.
 * Logs errors to the console and can be extended to report to Sentry or other monitoring services.
 * All unexpected errors should be funneled through this function.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
	// In the future, this can be connected to Sentry or another error tracking service.
	// For now, we log to the console with a structured format.
	if (context) {
		console.error('Error reported:', error, 'Context:', context);
	} else {
		console.error('Error reported:', error);
	}
}
