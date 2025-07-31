import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {dismissError, selectFastPaceError, selectSlowPaceError} from "@/ducks/division/index.ts";
import type {PaceType} from "@/src/types.ts";
import Alert from "react-bootstrap/Alert";

export default function DivisionAlerts() {
    const dispatch = useAppDispatch();
    const fastError = useSelector(selectFastPaceError);
    const slowError = useSelector(selectSlowPaceError);

    const onDismiss = (type: PaceType) => {
        dispatch(dismissError(type));
    }

    return (
        <div>
            {!!fastError && (
                <Alert variant="danger" dismissible onClose={() => onDismiss('fast')}>
                    <Alert.Heading className="me-3">Pace by Division</Alert.Heading>{fastError}
                </Alert>
            )}
            {!!slowError && (
                <Alert variant="danger" dismissible onClose={() => onDismiss('slow')}>
                    <Alert.Heading className="me-3">Pace by Division</Alert.Heading>{slowError}
                </Alert>
            )}
        </div>
    )
}
