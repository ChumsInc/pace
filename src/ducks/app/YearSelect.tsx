import React, {ChangeEvent, useId, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectYear, setYear} from "./index";
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import InputGroup from 'react-bootstrap/InputGroup';

const years = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1];

const YearSelect = () => {
    const dispatch = useAppDispatch();
    const year = useSelector(selectYear);
    const [currentYear] = useState(new Date().getFullYear());
    const labelId = useId();
    const selectId = useId();


    const yearChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setYear(ev.target.value));
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text>
                <FormLabel htmlFor={selectId} column="sm">
                    Year
                </FormLabel>
            </InputGroup.Text>
            <FormSelect id={selectId} value={year} onChange={yearChangeHandler}>
                {years.map(y => currentYear + y)
                    .sort()
                    .reverse()
                    .map(year => (
                        <option key={year} value={year.toString()}>{year.toString()}</option>))}
            </FormSelect>
        </InputGroup>
    )
}

export default YearSelect;
