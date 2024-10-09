import React from 'react';
import YearSelect from "./YearSelect";
import MonthSelect from "./MonthSelect";
import ReloadButton from "../../components/ReloadButton";
import Stack from 'react-bootstrap/Stack'
import {useParams} from "react-router-dom";
import DivisionTitle from "../division/DivisionTitle";
import CustomerTitle from "../customer/CustomerTitle";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


const AppBar = () => {
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
            <Col />
            <Col xs="auto">
                <ReloadButton/>
            </Col>
        </Row>
    )
}

export default AppBar
