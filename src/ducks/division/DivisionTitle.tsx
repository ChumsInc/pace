import React from 'react';
import {useSelector} from "react-redux";
import {selectDivisionsLoaded} from "./selectors";
import PaceAsOfDate from "../../components/PaceAsOfDate";

const DivisionTitle = () => {
    const loaded = useSelector(selectDivisionsLoaded);
    return (
        <div>
            <h2>Revenue Sales</h2>
            <div><PaceAsOfDate updated={loaded}/></div>
        </div>
    )
}

export default DivisionTitle;
