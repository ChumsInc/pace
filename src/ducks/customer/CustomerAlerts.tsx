import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {dismissError, selectFastPaceError, selectSlowPaceError} from "@/ducks/customer/index.ts";
import type {PaceType} from "@/src/types.ts";
import Alert from "react-bootstrap/Alert";

export default function CustomerAlerts() {
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
                    {fastError}
                </Alert>
            )}
            {!!slowError && (
                <Alert variant="danger" dismissible onClose={() => onDismiss('fast')}>
                    Slow Pace: {slowError}
                </Alert>
            )}
        </div>
    )
}
