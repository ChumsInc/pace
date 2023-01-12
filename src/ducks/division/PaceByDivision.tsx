import React, {Fragment, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {
    selectDivisionsLoaded,
    selectExpanded,
    selectFastError,
    selectPace,
    selectSlowError,
    selectSlowPace
} from "./selectors";
import {divisionPaceKey} from "./utils";
import PaceTR from "../../components/PaceTR";
import {useAppDispatch} from "../../app/configureStore";
import {loadByDivision, slowLoadByDivision, toggleExpanded} from "./actions";
import SegmentRows from "../segment/SegmentRows";
import {Link} from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from "@mui/material/TableFooter";
import Alert from '@mui/material/Alert';
import {selectDates} from "../app";
import {loadBySegment, slowLoadBySegment} from "../segment/actions";
import {selectProfileValid} from "../profile";
import {paceReducer, paceRow, zeroTotal} from "../../utils";
import {DivisionPaceRow} from "../../types";
import Decimal from "decimal.js";

const DivisionLink = ({arDivisionNo, children}: { arDivisionNo: string, children: React.ReactNode }) => (
    <Link to={`/${arDivisionNo}`}>{children}</Link>);


const PaceByDivision = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const fastPace = useSelector(selectPace);
    const slowPace = useSelector(selectSlowPace);
    const loaded = useSelector(selectDivisionsLoaded);
    const fastError = useSelector(selectFastError);
    const slowError = useSelector(selectSlowError);
    const expanded = useSelector(selectExpanded);
    const dates = useSelector(selectDates);
    const [currentYear] = useState(new Date().getFullYear().toString());
    const [currentMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [pace, setPace] = useState(fastPace.map(row => paceRow<DivisionPaceRow>(slowPace, divisionPaceKey)(row)))
    const [total, setTotal] = useState(zeroTotal);

    useEffect(() => {
        const pace = fastPace.map(row => paceRow<DivisionPaceRow>(slowPace, divisionPaceKey)(row))
        const total = pace.reduce(paceReducer, zeroTotal);
        setPace(pace);
        setTotal(total);
    }, [loaded]);

    useEffect(() => {
        if (!valid) {
            return;
        }
        dispatch(loadByDivision({...dates}));
        dispatch(loadBySegment({...dates}))
        if (dates.year === currentYear && dates.month === currentMonth) {
            dispatch(slowLoadByDivision({...dates}));
            dispatch(slowLoadBySegment({...dates}));
        }
    }, [valid, dates])

    const toggleHandler = (ARDivisionNo: string) => dispatch(toggleExpanded(ARDivisionNo));

    return (
        <div className="mt-5">
            {!!fastError && <Alert severity="error">{fastError}</Alert>}
            {!!slowError && <Alert severity="error">Slow Pace: {slowError}</Alert>}
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{'& th': {fontWeight: 700, fontSize: '1rem'}}}>
                            <TableCell></TableCell>
                            <TableCell colSpan={2}>Division</TableCell>
                            <TableCell align="right">Invoiced</TableCell>
                            <TableCell align="right">Open Orders</TableCell>
                            <TableCell align="right">Prev Open</TableCell>
                            <TableCell align="right">On Hold</TableCell>
                            <TableCell align="right">Pace</TableCell>
                            <TableCell align="right">Goal</TableCell>
                            <TableCell align="right">%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pace
                            .filter(row => row.ARDivisionNo !== '10')
                            .filter(row => !(row.ARDivisionNo === '00' && new Decimal(row.Pace).equals(0)))
                            .map(row => (
                                <Fragment key={row.ARDivisionNo}>
                                    <PaceTR
                                        link={<DivisionLink
                                            arDivisionNo={row.ARDivisionNo}>{row.ARDivisionNo}</DivisionLink>}
                                        description={<DivisionLink
                                            arDivisionNo={row.ARDivisionNo}>{row.ARDivisionDesc}</DivisionLink>}
                                        pace={row}
                                        goal={row.goal ?? 0}
                                        toggled={expanded[row.ARDivisionNo]}
                                        onToggle={() => toggleHandler(row.ARDivisionNo)}
                                        showPercent
                                        trProps={{sx: {'& > td': {borderBottomWidth: expanded[row.ARDivisionNo] ? 0 : undefined}}}}/>
                                    {expanded[row.ARDivisionNo] && (<SegmentRows arDivisionNo={row.ARDivisionNo}/>)}
                                </Fragment>
                            ))
                        }

                    </TableBody>
                    <TableFooter>
                        <PaceTR link={'Total'} description={'Chums Total'} pace={total}
                                goal={total.goal} showPercent
                                trProps={{sx: {'& > td': {fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap'}}}}/>

                    </TableFooter>
                </Table>
            </TableContainer>

            <TableContainer className="mt-5">
                <h2>Non-Revenue Sales</h2>
                <Table>
                    <TableHead>
                        <TableRow sx={{'& th': {fontWeight: 700, fontSize: '1rem'}}}>
                            <TableCell></TableCell>
                            <TableCell colSpan={2}>Division</TableCell>
                            <TableCell align="right">Invoiced</TableCell>
                            <TableCell align="right">Open Orders</TableCell>
                            <TableCell align="right">Prev Open</TableCell>
                            <TableCell align="right">On Hold</TableCell>
                            <TableCell align="right">Pace</TableCell>
                            <TableCell align="right">Goal</TableCell>
                            <TableCell align="right">%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fastPace
                            .filter(row => row.ARDivisionNo === '10')
                            .map(row => (
                                <Fragment key={row.ARDivisionNo}>
                                    <PaceTR
                                        link={<DivisionLink
                                            arDivisionNo={row.ARDivisionNo}>{row.ARDivisionNo}</DivisionLink>}
                                        description={<DivisionLink
                                            arDivisionNo={row.ARDivisionNo}>{row.ARDivisionDesc}</DivisionLink>}
                                        pace={row}
                                        goal={row.goal}
                                        toggled={expanded[row.ARDivisionNo]}
                                        onToggle={() => toggleHandler(row.ARDivisionNo)}
                                        showPercent
                                        trProps={{sx: {'& > td': {py: '0.5rem'}}}}/>
                                    {expanded[row.ARDivisionNo] && (<SegmentRows arDivisionNo={row.ARDivisionNo}/>)}
                                </Fragment>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )
}

export default PaceByDivision;
