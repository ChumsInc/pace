import React from 'react';
import YearSelect from "./YearSelect";
import MonthSelect from "./MonthSelect";
import DivisionReloadButton from "../byDivision/DivisionReloadButton";

const AppBar = () => {
    return (
        <div className="row g-3">
            <div className="col-auto">
                <div className="input-group">
                    <div className="input-group-text">Year</div>
                    <YearSelect/>
                </div>
            </div>
            <div className="col-auto">
                <div className="input-group">
                    <div className="input-group-text">Month</div>
                    <MonthSelect/>
                </div>
            </div>
            <div className="col-auto">
                <DivisionReloadButton/>
            </div>
        </div>
    )
}

export default AppBar
