import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import Table from "react-bootstrap/Table";
import PaceTR from "../../components/PaceTR";
import {Fragment} from 'react';
import {selectExpanded, selectPace, selectPaceTotal, toggleExpanded} from "./index";
import SegmentRows from "../segment/SegmentRows";
import Decimal from "decimal.js";
import DivisionLink from "@/ducks/division/DivisionLink.tsx";


export default function DivisionTable() {
    const dispatch = useAppDispatch();
    const expanded = useSelector(selectExpanded);
    const pace = useAppSelector(selectPace);
    const total = useAppSelector(selectPaceTotal);

    const toggleHandler = (ARDivisionNo: string) => {
        dispatch(toggleExpanded(ARDivisionNo));
    }

    return (
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
                        <PaceTR link={(
                            <DivisionLink arDivisionNo={row.ARDivisionNo}>
                                {row.ARDivisionNo}
                            </DivisionLink>
                        )}
                                description={(
                                    <DivisionLink arDivisionNo={row.ARDivisionNo}>
                                        {row.ARDivisionDesc}
                                    </DivisionLink>
                                )}
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
    )
}
