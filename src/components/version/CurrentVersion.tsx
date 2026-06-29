import {useVersion} from "@/components/version/useVersion.ts";
import {useCallback} from "react";
import type {Variant} from "react-bootstrap/esm/types";
import Alert from "react-bootstrap/Alert";
import {Spinner} from "react-bootstrap";

export default function CurrentVersion() {
    const {version, error, status, onClick} = useVersion();
    const getVariant = useCallback((): Variant => {
        switch (status) {
            case 'error':
                return 'danger';
            case 'has-update':
                return 'warning';
            default:
                return 'info';
        }
    }, [status]);

    const variant = getVariant();
    return (
        <Alert variant={variant} className="d-flex" onClick={onClick}>
            <Alert.Heading as="div" className="me-2">
                <span className="bi-info-circle me-2"/>
                Version:
            </Alert.Heading>
            <div className="ms-2">
                <span>{version ?? 'unknown'}</span>
                {error !== null && (<span>Error: {error}</span>)}
                {status === 'loading' && <Spinner animation="border" size="sm" className="ms-2"/>}
            </div>
        </Alert>
    )
}
