import React from 'react';
import {useSelector} from "react-redux";
import {selectLoaded, selectPace, selectPaceTotal, selectSlowPace} from "./selectors";
import {getSlowCurrentInvoiced, getSlowInvoiced, paceTotal} from "./utils";
import PaceTR from "../../components/PaceTR";

const captionStyle = {};

const PaceByDivision = () => {
    const pace = useSelector(selectPace);
    const slowPace = useSelector(selectSlowPace);
    const total = useSelector(selectPaceTotal);
    const loaded = useSelector(selectLoaded);

    const toggleHandler = undefined; // = () => {};

    return (
        <>
            <table className="table table-hover mt-5" style={{captionSide: 'top'}}>
                <caption style={captionStyle}>
                    <h2>Revenue Sales</h2>
                    {!!loaded && <div><small>As of {new Date(loaded).toLocaleString()}</small></div>}
                </caption>
                <thead>
                <tr>
                    <th colSpan={2}>Division</th>
                    <th className="text-end">Invoiced</th>
                    <th className="text-end">Open Orders</th>
                    <th className="text-end">Prev Open</th>
                    <th className="text-end">On Hold</th>
                    <th className="text-end">Pace</th>
                    <th className="text-end">Goal</th>
                </tr>
                </thead>
                <tbody id="pace-tbody">
                {pace
                    .filter(row => row.ARDivisionNo !== '10')
                    .filter(row => row.ARDivisionNo !== '00' || !paceTotal(row, getSlowInvoiced(slowPace, row.ARDivisionNo), getSlowCurrentInvoiced(slowPace, row.ARDivisionNo)).equals(0))
                    .map(row => (
                        <PaceTR key={row.ARDivisionNo} link={row.ARDivisionNo} description={row.ARDivisionDesc}
                                pace={row}
                                invoiced={getSlowInvoiced(slowPace, row.ARDivisionNo)}
                                current={getSlowCurrentInvoiced(slowPace, row.ARDivisionNo)} goal={row.goal}
                                toggled={false} onToggle={toggleHandler}/>
                    ))
                }
                </tbody>
                <tfoot id="pace-tfoot" style={{fontWeight: 700}}>
                <PaceTR link={'Total'} description={'Chums Total'} pace={total}
                        goal={total.goal}/>
                </tfoot>
            </table>

            <table className="table table-hover mt-5" style={{captionSide: 'top'}}>
                <caption style={captionStyle}><h2>Non-Revenue Sales</h2></caption>
                <thead>
                <tr>
                    <th colSpan={2}>Division</th>
                    <th className="text-end">Invoiced</th>
                    <th className="text-end">Open Orders</th>
                    <th className="text-end">Prev Open</th>
                    <th className="text-end">On Hold</th>
                    <th className="text-end">Pace</th>
                    <th className="text-end">Goal</th>
                </tr>
                </thead>
                <tbody id="pace-tbody">
                {pace
                    .filter(row => row.ARDivisionNo === '10')
                    .map(row => (
                        <PaceTR key={row.ARDivisionNo} link={row.ARDivisionNo} description={row.ARDivisionDesc} pace={row}
                                invoiced={getSlowInvoiced(slowPace, row.ARDivisionNo)}
                                current={getSlowCurrentInvoiced(slowPace, row.ARDivisionNo)} goal={row.goal}/>
                    ))
                }
                </tbody>
            </table>

        </>

    )
}

export default PaceByDivision;
