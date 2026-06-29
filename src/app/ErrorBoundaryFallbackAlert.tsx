import type {FallbackProps} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            {error instanceof Error && (
                <>
                    <div>
                        {error.message}
                    </div>
                    <pre>{error.stack}</pre>
                </>
            )}
            {!(error instanceof Error) && (
                <>
                    <div>An unknown error occurred</div>
                    <pre>{JSON.stringify(error)}</pre>
                    <pre>{JSON.stringify(error)}</pre>
                </>
            )}
        </Alert>
    )
}
