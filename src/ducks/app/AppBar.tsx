import React, {useEffect} from 'react';
import YearSelect from "./YearSelect";
import MonthSelect from "./MonthSelect";
import ReloadButton from "../../components/ReloadButton";
import Stack from 'react-bootstrap/Stack'
import {useParams} from "react-router";
import DivisionTitle from "../division/DivisionTitle";
import CustomerTitle from "../customer/CustomerTitle";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PaceAsOfDate from "../../components/PaceAsOfDate";
import {useSelector} from "react-redux";
import {selectDivisionsLoaded} from "../division/selectors";
import {selectCustomersLoaded} from "../customer/selectors";
import dayjs from "dayjs";


const AppBar = () => {
    const divisions = useSelector(selectDivisionsLoaded);
    const customers = useSelector(selectCustomersLoaded);
    const [updated, setUpdated] = React.useState<string|null>(null);

    useEffect(() => {
        if (!divisions || !customers) {
            setUpdated(null);
            return;
        }
        setUpdated(new Date().toISOString());
    }, [divisions, customers]);

    const {arDivisionNo} = useParams<'arDivisionNo' | 'segment'>()

    return (
        <Row className="mt-3 align-items-start">
            <Col xs="auto">
                {!arDivisionNo && (<DivisionTitle/>)}
                {!!arDivisionNo && (<CustomerTitle/>)}
            </Col>
            <Col xs="auto">
                <Stack direction="horizontal" gap={2}>
                    <YearSelect/>
                    <MonthSelect/>
                </Stack>
            </Col>
            <Col>
                <PaceAsOfDate updated={updated}/>
            </Col>
            <Col xs="auto">
                <ReloadButton/>
            </Col>
        </Row>
    )
}

export default AppBar
