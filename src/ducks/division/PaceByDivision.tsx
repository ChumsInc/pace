import {useCallback, useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadByDivision, slowLoadByDivision} from "./actions";
import {selectDates, selectShouldLoadSlowPace} from "../app";
import {loadBySegment, slowLoadBySegment} from "../segment/actions";
import DivisionAlerts from "@/ducks/division/DivisionAlerts.tsx";
import NonRevenueSales from "@/ducks/division/NonRevenueSales.tsx";
import DivisionTable from "@/ducks/division/DivisionTable.tsx";
import type {PaceArgs} from "@/src/types.ts";
import {selectProfileValid} from "@/ducks/profile";

const PaceByDivision = () => {
    const dispatch = useAppDispatch();
    const valid = useAppSelector(selectProfileValid);
    const dates = useSelector(selectDates);
    const shouldLoadSlowPace = useAppSelector(selectShouldLoadSlowPace);
    const timerRef = useRef<number>(0);

    const loadHandler = useCallback((args: PaceArgs, shouldLoadSlowPace: boolean) => {
        dispatch(loadByDivision({...args}));
        dispatch(loadBySegment({...args}))
        if (shouldLoadSlowPace) {
            dispatch(slowLoadByDivision({...args}));
            dispatch(slowLoadBySegment({...args}));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!valid) {
            return;
        }
        loadHandler(dates, shouldLoadSlowPace);
        timerRef.current = window.setInterval(() => {
            loadHandler(dates, shouldLoadSlowPace)
        }, 10 * 60 * 1000);
        return () => {
            window.clearInterval(timerRef.current);
        }
    }, [valid, dates, shouldLoadSlowPace, loadHandler]);



    return (
        <div className="mt-5">
            <DivisionAlerts/>
            <DivisionTable/>
            <NonRevenueSales/>
        </div>

    )
}

export default PaceByDivision;
