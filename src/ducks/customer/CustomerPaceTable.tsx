import {customerFields} from "@/ducks/customer/CustomerFields.tsx";
import {customerKey, filterCustomerPace} from "@/ducks/customer/utils.ts";
import numeral from "numeral";
import {numeralFormat} from "@/app/constants.ts";
import Table from "react-bootstrap/Table";
import {useSelector} from "react-redux";
import {selectSort, selectSortedPace, setSort} from "@/ducks/customer/index.ts";
import type {CustomerPaceRow} from "@/src/types.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useEffect, useState} from "react";
import {paceReducer, zeroTotal} from "@/src/utils.ts";
import {useParams} from "react-router";
import {DataTableRow, SortableTableTH} from "@chumsinc/sortable-tables";
import type {SortProps} from "chums-types";

export default function CustomerPaceTable() {
    const dispatch = useAppDispatch();
    const {arDivisionNo, segment} = useParams<'arDivisionNo' | 'segment'>();
    const pace = useSelector(selectSortedPace);
    const sort = useSelector(selectSort);
    const [filtered, setFiltered] = useState<CustomerPaceRow[]>(filterCustomerPace(pace, {arDivisionNo, segment}))
    const [total, setTotal] = useState(zeroTotal);

    useEffect(() => {
        const filtered = filterCustomerPace(pace, {arDivisionNo, segment});
        const total = filtered.reduce(paceReducer, zeroTotal);
        setFiltered(filtered);
        setTotal(total);
    }, [pace, arDivisionNo, segment]);

    const sortChangeHandler = (nextSort: SortProps<CustomerPaceRow>) => {
        dispatch(setSort(nextSort));
    }

    return (
        <Table size="small">
            <thead>
            <tr style={{fontWeight: 700, fontSize: '1rem'}}>
                {customerFields.map((field, index) => (
                    <SortableTableTH field={field} onClick={sortChangeHandler} key={index}
                                     sorted={field.field === sort.field} ascending={sort.ascending}/>
                ))}
            </tr>
            </thead>
            <tbody>
            {filtered.map(row => (
                <DataTableRow key={customerKey(row)} row={row} fields={customerFields}/>
            ))}
            </tbody>
            <tfoot>
            <tr style={{fontWeight: 700, fontSize: '1rem', color: 'var(--bs-body-color)'}}>
                <th colSpan={2}>Total</th>
                <td className="text-end">{numeral(total.InvoiceTotal).format(numeralFormat)}</td>
                <td className="text-end">{numeral(total.OpenOrderTotal).format(numeralFormat)}</td>
                <td
                    className="text-end">{numeral(total.PrevOpenOrderTotal).format(numeralFormat)}</td>
                <td className="text-end">{numeral(total.HeldOrderTotal).format(numeralFormat)}</td>
                <td className="text-end">{numeral(total.Pace).format(numeralFormat)}</td>
            </tr>
            </tfoot>
        </Table>
    )
}
