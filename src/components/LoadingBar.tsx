import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectPaceLoading} from "../ducks/division/selectors";
import {selectCustomerPaceLoading} from "../ducks/customer/selectors";
import {selectSegmentsPaceLoading} from "../ducks/segment/selectors";
import {ProgressBar} from "react-bootstrap";

const LoadingBar = () => {
    const divisionsLoading = useSelector(selectPaceLoading);
    const customersLoading = useSelector(selectCustomerPaceLoading);
    const segmentsLoading = useSelector(selectSegmentsPaceLoading);
    const [loading, setLoading] = useState(divisionsLoading || segmentsLoading || customersLoading);

    useEffect(() => {
        setLoading(divisionsLoading || segmentsLoading || customersLoading);
    }, [divisionsLoading, customersLoading , segmentsLoading]);

    return (
        <div>
            {loading && <ProgressBar striped={true} animated={true} now={100} style={{height: '5px'}} />}
        </div>
    )
}

export default LoadingBar;
