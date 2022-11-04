import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {loadByDivision, loadDivisionPace, slowLoadByDivision} from "./actions";
import {useSelector} from "react-redux";
import {selectMonth, selectYear} from "../app";
import {selectPaceLoading} from "./selectors";
import SpinnerButton from "chums-components/dist/SpinnerButton";

const DivisionReloadButton = () => {
    const dispatch = useAppDispatch();
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);
    const loading = useSelector(selectPaceLoading);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        reloadHandler();
        return () => {
            window.clearInterval(timer);
        }
    }, []);



    const reloadHandler = () => {
        window.clearInterval(timer);
        if (document.visibilityState === 'hidden') {
            document.addEventListener('visibilitychange', reloadHandler, {once: true});
            return;
        }
        const now = new Date();
        const currentYear = now.getFullYear().toString();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

        dispatch(loadByDivision({year, month}));
        if (year === currentYear && month === currentMonth) {
            dispatch(slowLoadByDivision({year, month}));
        }
        const interval = window.setInterval(reloadHandler, 15 * 60 * 1000);
        setTimer(() => interval);
    }

    return (<SpinnerButton spinning={loading} onClick={reloadHandler}>Load Pace</SpinnerButton>)
}

export default DivisionReloadButton;
