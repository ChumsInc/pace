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
import {Link} from "react-router";
import Table from "react-bootstrap/Table";
import Alert from 'react-bootstrap/Alert';
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

    const toggleHandler = (ARDivisionNo: string) => {

        dispatch(toggleExpanded(ARDivisionNo));
    }

    return (
        <div className="mt-5">
            {!!fastError && <Alert variant="error">{fastError}</Alert>}
            {!!slowError && <Alert variant="error">Slow Pace: {slowError}</Alert>}
            <div>
                <Table responsive="sm">
                    <thead>
                    <tr style={{fontWeight: 700, fontSize: '1rem'}}>
                        <th></th>
                        <th colSpan={2}>Division</th>
                        <th className="text-end">Invoiced</th>
                        <th className="text-end">Open Orders</th>
                        <th className="text-end">Prev Open</th>
                        <th className="text-end">On Hold</th>
                        <th className="text-end">Pace</th>
                        <th className="text-end">Goal</th>
                        <th className="text-end">%</th>
                    </tr>
                    </thead>
                    <tbody>
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
                                    progress={row.goal ? new Decimal(row.Pace).div(row.goal).toNumber() : undefined}
                                    trProps={{style: {borderBottomWidth: expanded[row.ARDivisionNo] ? 0 : undefined}}}/>
                                {expanded[row.ARDivisionNo] && (<SegmentRows arDivisionNo={row.ARDivisionNo}/>)}
                            </Fragment>
                        ))
                    }

                    </tbody>
                    <tfoot>
                    <PaceTR link={'Total'} description={'Chums Total'} pace={total}
                            goal={total.goal} showPercent
                            progress={total.goal ? new Decimal(total.Pace).div(total.goal).toNumber() : undefined}
                            trProps={{
                                style: {fontWeight: 700, fontSize: '112.5%', whiteSpace: 'nowrap'},
                                className: 'my-3'
                            }}/>

                    </tfoot>
                </Table>
            </div>

            <div className="mt-5">
                <h2>Non-Revenue Sales</h2>
                <Table responsive="sm">
                    <thead>
                    <tr style={{fontWeight: 700, fontSize: '1rem'}}>
                        <th></th>
                        <th colSpan={2}>Division</th>
                        <th className="text-end">Invoiced</th>
                        <th className="text-end">Open Orders</th>
                        <th className="text-end">Prev Open</th>
                        <th className="text-end">On Hold</th>
                        <th className="text-end">Pace</th>
                        <th className="text-end">Goal</th>
                        <th className="text-end">%</th>
                    </tr>
                    </thead>
                    <tbody>
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
                                    trProps={{className: 'my-3'}}/>
                                {expanded[row.ARDivisionNo] && (<SegmentRows arDivisionNo={row.ARDivisionNo}/>)}
                            </Fragment>
                        ))
                    }
                    </tbody>
                </Table>
            </div>
        </div>

    )
}

export default PaceByDivision;
