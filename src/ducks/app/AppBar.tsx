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


export default function AppBar() {
    const {arDivisionNo} = useParams<'arDivisionNo' | 'segment'>()
    return (
        <Row className="mt-3 align-items-center">
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
                <PaceAsOfDate/>
            </Col>
            <Col xs="auto">
                <ReloadButton/>
            </Col>
        </Row>
    )
}
