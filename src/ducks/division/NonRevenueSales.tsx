import Table from "react-bootstrap/Table";
import {Fragment} from "react";
import PaceTR from "@/components/PaceTR.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectPace} from "@/ducks/division/index.ts";
import DivisionLink from "@/ducks/division/DivisionLink.tsx";

export default function NonRevenueSales() {
    const pace = useAppSelector(selectPace);
    return (
        <div className="mt-5">
            <h2>Non-Revenue Sales</h2>
            <Table responsive="sm">
                <thead>
                <tr style={{fontWeight: 700, fontSize: '1rem'}}>
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
                    .filter(row => row.ARDivisionNo === '10')
                    .map(row => (
                        <Fragment key={row.ARDivisionNo}>
                            <PaceTR
                                link={(
                                    <DivisionLink arDivisionNo={row.ARDivisionNo}>
                                        {row.ARDivisionNo}
                                    </DivisionLink>)}
                                description={(
                                    <DivisionLink arDivisionNo={row.ARDivisionNo}>
                                        {row.ARDivisionDesc}
                                    </DivisionLink>)}
                                pace={row}
                                goal={row.goal}
                                // toggled={false}
                                // onToggle={() => {
                                // }}
                                showPercent
                                trProps={{className: 'my-3'}}/>
                        </Fragment>
                    ))
                }
                </tbody>
            </Table>
        </div>
    )
}
