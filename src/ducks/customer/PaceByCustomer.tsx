import {useCallback, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {useParams} from "react-router";
import type {PaceArgs} from "../../types";
import {loadCustomers, slowLoadCustomers} from "./actions";
import {selectDates, selectShouldLoadSlowPace} from "../app";
import {selectDivisionsLastUpdated} from "@/ducks/division";
import {loadByDivision} from "../division/actions";
import CustomerAlerts from "@/ducks/customer/CustomerAlerts.tsx";
import CustomerPaceTable from "@/ducks/customer/CustomerPaceTable.tsx";
import {selectProfileValid} from "@/ducks/profile";


const PaceByCustomer = () => {
    const dispatch = useAppDispatch();
    const valid = useAppSelector(selectProfileValid);
    const {arDivisionNo} = useParams<'arDivisionNo' | 'segment'>();
    const shouldLoadSlowPace = useAppSelector(selectShouldLoadSlowPace);
    const dates = useSelector(selectDates);
    const divisionsLoaded = useSelector(selectDivisionsLastUpdated);
    const timer = useRef<number>(0)

    const loadHandler = useCallback((args: PaceArgs, shouldLoadSlowPace: boolean) => {
        if (!divisionsLoaded) {
            dispatch(loadByDivision(args));
        }
        dispatch(loadCustomers(args));
        if (shouldLoadSlowPace) {
            dispatch(slowLoadCustomers(args));
        }
    }, [dispatch, divisionsLoaded]);

    useEffect(() => {
        if (!valid) {
            return;
        }
        loadHandler({...dates, ARDivisionNo: arDivisionNo}, shouldLoadSlowPace);
        timer.current = window.setInterval(() => {
            loadHandler({...dates, ARDivisionNo: arDivisionNo}, shouldLoadSlowPace);
        }, 10 * 60 * 1000);
        return () => {
            window.clearInterval(timer.current);
        }
    }, [valid, arDivisionNo, shouldLoadSlowPace, dates, loadHandler]);

    return (
        <div className="mt-5">
            <CustomerAlerts/>
            <CustomerPaceTable/>
        </div>
    )
}

export default PaceByCustomer;
