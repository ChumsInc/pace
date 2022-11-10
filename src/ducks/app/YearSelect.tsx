import React, {useId, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectYear, setYear} from "./index";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';


const years = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1];

const YearSelect = () => {
    const dispatch = useAppDispatch();
    const year = useSelector(selectYear);
    const [currentYear] = useState(new Date().getFullYear());
    const labelId = useId();
    const selectId = useId();


    const yearChangeHandler = (ev: SelectChangeEvent) => {
        dispatch(setYear(ev.target.value));
    }

    return (
        <FormControl variant="standard" sx={{minWidth: 120}}>
            <InputLabel id={labelId}>Year</InputLabel>
            <Select id={selectId} labelId={labelId} value={year} onChange={yearChangeHandler}>
                {years.map(y => currentYear + y)
                    .sort()
                    .reverse()
                    .map(year => (
                    <MenuItem key={year} value={year.toString()}>{year.toString()}</MenuItem>))}
            </Select>

        </FormControl>
    )
}

export default YearSelect;
