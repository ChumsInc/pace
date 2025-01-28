import React, {useEffect, useRef} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {loadUserValidation, selectProfileError, selectProfileLoading, selectProfileValid} from "./index";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";

const ProfileStatus = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const loading = useSelector(selectProfileLoading);
    const error = useSelector(selectProfileError);
    const intervalHandle = useRef<number>(0)


    useEffect(() => {
        dispatch(loadUserValidation());
    }, []);

    useEffect(() => {
        if (valid) {
            intervalHandle.current = window.setInterval(() => {
                dispatch(loadUserValidation())
            }, 30 * 60 * 1000);
        }
        return () => {
            window.clearTimeout(intervalHandle.current);
        }
    }, [valid, loading]);

    return (
        <div className="mt-1">
            {!valid && !loading && <Alert variant="warning">Login is required</Alert>}
            {loading && <ProgressBar striped animated now={100} style={{height: '0.5rem'}} variant="info"/>}
            {!!error && <Alert variant="error">
                <Alert.Heading>User Validation Error</Alert.Heading>
                {error}
            </Alert>}
        </div>
    )
}
export default ProfileStatus;
