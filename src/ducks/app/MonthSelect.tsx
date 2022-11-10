import React, {useId} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectMonth, setMonth} from "./index";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';


const MonthSelect = () => {
    const dispatch = useAppDispatch();
    const month = useSelector(selectMonth);
    const labelId = useId();
    const selectId = useId();


    const changeHandler = (ev: SelectChangeEvent) => {
        dispatch(setMonth(ev.target.value));
    }

    return (
        <FormControl variant="standard" sx={{minWidth: 120}}>
            <InputLabel id={labelId}>Month</InputLabel>
            <Select id={selectId} labelId={labelId} value={month} onChange={changeHandler}>
                <MenuItem value="01">January</MenuItem>
                <MenuItem value="02">February</MenuItem>
                <MenuItem value="03">March</MenuItem>
                <MenuItem value="04">April</MenuItem>
                <MenuItem value="05">May</MenuItem>
                <MenuItem value="06">June</MenuItem>
                <MenuItem value="07">July</MenuItem>
                <MenuItem value="08">August</MenuItem>
                <MenuItem value="09">September</MenuItem>
                <MenuItem value="10">October</MenuItem>
                <MenuItem value="11">November</MenuItem>
                <MenuItem value="12">December</MenuItem>
            </Select>
        </FormControl>
    )
}

export default MonthSelect;
