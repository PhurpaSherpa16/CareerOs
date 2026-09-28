import ErrorMessage from '../../../components/ErrorMessage';

interface ReportErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export default function ReportErrorState({ onRetry, message }: ReportErrorStateProps) {
  return (
    <div className="py-8">
      <ErrorMessage
        onRetry={onRetry}
        title="Failed to Load Report"
        message={message || 'There was an error generating or retrieving this analysis report. Please try again.'}
      />
    </div>
  );
}
