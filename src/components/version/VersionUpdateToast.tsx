import {useVersion} from "@/components/version/useVersion.ts";
import {Offcanvas} from "react-bootstrap";
import {startTransition, useEffect, useState} from "react";

export default function VersionUpdateToast() {
    const {status} = useVersion();
    const [show, setShow] = useState(false);
    useEffect(() => {
        startTransition(() => {
            if (status === 'has-update') {
                setShow(true);
            }
        })
    }, [status]);

    const closeHandler = () => {
        setShow(false);
    }

    return (
        <Offcanvas show={show} onHide={closeHandler} placement="bottom">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Update Available</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                A new version is available. Please refresh the page to update.
            </Offcanvas.Body>
        </Offcanvas>
    )
}
