import React from 'react';
import YearSelect from "./YearSelect";
import MonthSelect from "./MonthSelect";
import ReloadButton from "../../components/ReloadButton";
import Stack from '@mui/material/Stack'
import {useParams} from "react-router-dom";
import DivisionTitle from "../division/DivisionTitle";
import CustomerTitle from "../customer/CustomerTitle";


const AppBar = () => {
    const {arDivisionNo} = useParams<'arDivisionNo' | 'segment'>()
    return (
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{my: '2rem'}} alignItems="top">
            <div style={{flex: '1 1 auto'}}>
                {!arDivisionNo && (<DivisionTitle/>)}
                {!!arDivisionNo && (<CustomerTitle/>)}
            </div>
            <Stack direction="row" spacing={1}>
                <div>
                    <YearSelect/>
                </div>
                <div>
                    <MonthSelect/>
                </div>
            </Stack>
            <div>
                <ReloadButton/>
            </div>
        </Stack>
    )
}

export default AppBar
