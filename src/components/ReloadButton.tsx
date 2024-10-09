import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {selectDates} from "../ducks/app";
import Button from "react-bootstrap/Button";
import {loadCustomers, slowLoadCustomers} from "../ducks/customer/actions";
import {useAppDispatch} from "../app/configureStore";
import {loadByDivision, slowLoadByDivision} from "../ducks/division/actions";
import {loadBySegment, slowLoadBySegment} from "../ducks/segment/actions";
import {selectExpanded, selectPaceLoading} from "../ducks/division/selectors";
import {selectCustomerPaceLoading} from "../ducks/customer/selectors";
import {selectSegmentsPaceLoading} from "../ducks/segment/selectors";
import {selectProfileValid} from "../ducks/profile";

const ReloadButton = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const dates = useSelector(selectDates);
    const params = useParams<'arDivisionNo'>();
    const expanded = useSelector(selectExpanded);
    const divisionsLoading = useSelector(selectPaceLoading);
    const customersLoading = useSelector(selectCustomerPaceLoading);
    const segmentsLoading = useSelector(selectSegmentsPaceLoading);

    const [loading, setLoading] = useState<boolean>(divisionsLoading || customersLoading || segmentsLoading);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
    const [currentMonth, setCurrentMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const intervalRef = useRef<number>(0);


    useEffect(() => {
        console.debug({valid, dates, currentYear, currentMonth, loading});
        if (valid && dates.year === currentYear && dates.month === currentMonth) {
            intervalRef.current = window.setInterval(reloadHandler, 15 * 60 * 1000);
        }
        return () => {
            window.clearInterval(intervalRef.current);
        }
    }, [dates, currentYear, currentMonth, valid, loading]);

    useEffect(() => {
        setLoading(divisionsLoading || customersLoading || segmentsLoading);
    }, [divisionsLoading, customersLoading, segmentsLoading]);

    const reloadHandler = () => {
        if (!valid) {
            return;
        }
        dispatch(loadByDivision({...dates}));

        if (params.arDivisionNo) {
            dispatch(loadCustomers({...dates, ARDivisionNo: params.arDivisionNo}));
            if (dates.year === currentYear && dates.month === currentMonth) {
                dispatch(slowLoadCustomers({...dates, ARDivisionNo: params.arDivisionNo}));
            }
        } else {
            if (dates.year === currentYear && dates.month === currentMonth) {
                dispatch(slowLoadByDivision({...dates}));
            }
            if (Object.keys(expanded).length && Object.values(expanded).filter(val => val).length) {
                dispatch(loadBySegment({...dates}))
                if (dates.year === currentYear && dates.month === currentMonth) {
                    dispatch(slowLoadBySegment({...dates}));
                }
            }
        }
    }

    return (
        <Button type="button" disabled={!valid || loading}
                variant="primary"
                onClick={reloadHandler}>
            Reload
        </Button>
    )
}

export default ReloadButton;
