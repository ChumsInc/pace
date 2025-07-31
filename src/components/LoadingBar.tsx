import {useEffect, useState} from 'react';
import {selectDivisionPaceLoading} from "@/ducks/division";
import {selectCustomerPaceLoading} from "@/ducks/customer";
import {selectSegmentsPaceLoading} from "@/ducks/segment";
import {ProgressBar} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore.ts";

const LoadingBar = () => {
    const divisionsLoading = useAppSelector(selectDivisionPaceLoading);
    const customersLoading = useAppSelector(selectCustomerPaceLoading);
    const segmentsLoading = useAppSelector(selectSegmentsPaceLoading);
    const [loading, setLoading] = useState(divisionsLoading || segmentsLoading || customersLoading);

    useEffect(() => {
        setLoading(divisionsLoading || segmentsLoading || customersLoading);
    }, [divisionsLoading, customersLoading, segmentsLoading]);

    return (
        <div>
            {loading && <ProgressBar striped={true} animated={true} now={100} style={{height: '5px'}}/>}
        </div>
    )
}

export default LoadingBar;
