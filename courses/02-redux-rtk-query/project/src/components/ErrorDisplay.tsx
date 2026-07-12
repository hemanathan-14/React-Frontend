interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    if ('error' in error && typeof (error as { error: unknown }).error === 'string') {
      return (error as { error: string }).error;
    }
    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
  }
  return 'Something went wrong. Please try again.';
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display" role="alert">
      <p>{getErrorMessage(error)}</p>
      {onRetry && (
        <button type="button" data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}