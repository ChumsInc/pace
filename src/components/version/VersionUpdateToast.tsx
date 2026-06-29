import {useVersion} from "@/components/version/useVersion.ts";
import {Toast, ToastContainer} from "react-bootstrap";
import {startTransition, useEffect, useState} from "react";

export default function VersionUpdateToast() {
    const {hasUpdate} = useVersion();
    const [show, setShow] = useState(false);
    useEffect(() => {
        startTransition(() => {
            if (hasUpdate) {
                setShow(true);
            }
        })
    }, [hasUpdate]);

    const closeHandler = () => {
        setShow(false);
    }

    return (
        <ToastContainer position="bottom-end">
            <Toast show={show} onClose={closeHandler} bg="warning" className="text-dark">
                <Toast.Header closeButton>
                    <strong className="me-auto">
                        Update Available
                    </strong>
                </Toast.Header>
                <Toast.Body>
                    A new version is available. Please refresh the page to update.
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
