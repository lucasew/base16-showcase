/**
 * Reports an error to the centralized error tracking system.
 * Currently logs to console, but can be extended to use Sentry or other services.
 *
 * @param message - A descriptive message for the error.
 * @param error - The error object or unknown error value.
 * @param context - Optional additional context to include with the error report.
 */
export function reportError(
	message: string,
	error?: unknown,
	context?: Record<string, unknown>
): void {
	if (error) {
		console.error(message, error, context);
	} else {
		console.error(message, context);
	}
}
