import {customerFields} from "@/ducks/customer/CustomerFields.tsx";
import classNames from "classnames";
import TableSortLabel from "@/components/TableSortLabel.tsx";
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

    const sortChangeHandler = (field: keyof CustomerPaceRow) => {
        if (sort.field === field) {
            return dispatch(setSort({...sort, ascending: !sort.ascending}));
        }
        dispatch(setSort({field, ascending: true}));
    }

    return (
        <Table size="small">
            <thead>
            <tr style={{fontWeight: 700, fontSize: '1rem', color: 'var(--bs-body-color)'}}>
                {customerFields.map((field, index) => (
                    <th key={index} className={classNames({[`text-${field.align}`]: !!field.align})}>
                        <TableSortLabel
                            active={sort.field === field.field}
                            iconBefore={field.align !== 'end'}
                            align={field.align}
                            direction={sort.field === field.field ? (sort.ascending ? 'asc' : 'desc') : 'asc'}
                            onClick={() => sortChangeHandler(field.field)}>
                            {field.title}
                        </TableSortLabel>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {filtered
                .map(row => (
                    <tr key={customerKey(row)}>
                        {customerFields.map((field, index) => (
                            <td key={index} className={classNames({[`text-${field.align}`]: !!field.align})}>
                                {!!field.render && (
                                    <>{field.render(row)}</>
                                )}
                                {!field.render && (
                                    <>{row[field.field]}</>
                                )}
                            </td>
                        ))}
                    </tr>
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
