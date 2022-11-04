import React, {ChangeEvent, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectYear, setYear} from "./index";


const years = [-3, -2, -1, 0, 1];

const YearSelect = () => {
    const dispatch = useAppDispatch();
    const year = useSelector(selectYear);
    const [currentYear] = useState(new Date().getFullYear());


    const yearChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setYear(ev.target.value));
    }

    return (
        <select className="form-select" value={year} onChange={yearChangeHandler}>
            {years.map(y => (
                <option key={y} value={(currentYear + y).toString()}>{(currentYear + y).toString()}</option>))}
        </select>
    )
}

export default YearSelect;
