import React from 'react';
import {useSelector} from "react-redux";
import {selectPaceLoading} from "../ducks/division/selectors";
import {selectCustomerPaceLoading} from "../ducks/customer/selectors";
import {selectSegmentsPaceLoading} from "../ducks/segment/selectors";
import LinearProgress from "@mui/material/LinearProgress";

const LoadingBar = () => {
    const divisionsLoading = useSelector(selectPaceLoading);
    const customersLoading = useSelector(selectCustomerPaceLoading);
    const segmentsLoading = useSelector(selectSegmentsPaceLoading);

    return (
        <div>
            {(divisionsLoading || segmentsLoading || customersLoading) && <LinearProgress variant="indeterminate" /> }
        </div>
    )
}

export default LoadingBar;
