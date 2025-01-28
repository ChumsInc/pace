import React from 'react';
import {FallbackProps} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            <div>
                {error.message}
            </div>
            <pre>{error.stack}</pre>
        </Alert>
    )
}
