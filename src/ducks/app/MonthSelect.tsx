import React, {ChangeEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectMonth, setMonth} from "./index";


const MonthSelect = () => {
    const dispatch = useAppDispatch();
    const month = useSelector(selectMonth);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setMonth(ev.target.value));
    }

    return (
        <select className="form-select" value={month} onChange={changeHandler}>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
        </select>
    )
}

export default MonthSelect;
