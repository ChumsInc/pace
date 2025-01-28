import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectMonth, setMonth} from "./index";
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import InputGroup from 'react-bootstrap/InputGroup';


const MonthSelect = () => {
    const dispatch = useAppDispatch();
    const month = useSelector(selectMonth);
    const selectId = useId();


    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setMonth(ev.target.value));
    }

    return (
        <InputGroup style={{minWidth: 'fit-content'}} >
            <InputGroup.Text>
                <FormLabel htmlFor={selectId} column="sm">Month</FormLabel>
            </InputGroup.Text>
            <FormSelect id={selectId} value={month} onChange={changeHandler}>
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
            </FormSelect>
        </InputGroup>
    )
}

export default MonthSelect;
