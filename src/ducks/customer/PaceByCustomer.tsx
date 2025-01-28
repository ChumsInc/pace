import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {
    selectCustomersLoaded,
    selectFastError,
    selectPace,
    selectSlowError,
    selectSlowPace,
    selectSort
} from "./selectors";
import {customerPaceSorter, paceReducer, paceRow, zeroTotal} from "../../utils";
import {useParams} from "react-router";
import {customerKey} from "./utils";
import {CustomerPaceRow} from "../../types";
import type {SortableTableField} from "sortable-tables";
import {loadCustomers, setSort, slowLoadCustomers} from "./actions";
import numeral from "numeral";
import {numeralFormat} from "../../app/constants";
import {selectDates} from "../app";
import classNames from "classnames";
import Decimal from "decimal.js";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import CustomerLink from "./CustomerLink";
import {selectProfileValid} from "../profile";
import {selectDivisionsLoaded} from "../division/selectors";
import {loadByDivision} from "../division/actions";
import TableSortLabel from "../../components/TableSortLabel";


const fields: SortableTableField<CustomerPaceRow>[] = [
    {
        field: 'CustomerNo',
        title: 'Customer',
        sortable: true,
        render: (row) => (<CustomerLink pace={row}>{customerKey(row)}</CustomerLink>)
    },
    {
        field: "CustomerName",
        title: 'Customer Name',
        sortable: true,
        render: (row) => (<CustomerLink pace={row}>{row.CustomerName}</CustomerLink>)
    },
    {
        field: 'InvoiceTotal',
        title: 'Invoiced',
        sortable: true,
        align: 'end',
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.InvoiceTotal).lt(0)}),
        render: (row) => numeral(row.InvoiceTotal).format(numeralFormat)
    },
    {
        field: 'OpenOrderTotal',
        title: 'Open Orders',
        sortable: true,
        align: 'end',
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.OpenOrderTotal).lt(0)}),
        render: (row) => numeral(row.OpenOrderTotal).format(numeralFormat)
    },
    {
        field: 'PrevOpenOrderTotal',
        title: 'Prev Open',
        sortable: true,
        align: 'end',
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.PrevOpenOrderTotal).lt(0)}),
        render: (row) => numeral(row.PrevOpenOrderTotal).format(numeralFormat)
    },
    {
        field: 'HeldOrderTotal',
        title: 'On Hold',
        sortable: true,
        align: 'end',
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.HeldOrderTotal).lt(0)}),
        render: (row) => numeral(row.HeldOrderTotal).format(numeralFormat)
    },
    {
        field: 'Pace',
        title: 'Pace',
        sortable: true,
        align: 'end',
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.Pace).lt(0)}),
        render: (row) => numeral(row.Pace).format(numeralFormat)
    },
];

const PaceByCustomer = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const pace = useSelector(selectPace);
    const slowPace = useSelector(selectSlowPace);
    const sort = useSelector(selectSort);
    const loaded = useSelector(selectCustomersLoaded);
    const {arDivisionNo, segment} = useParams<'arDivisionNo' | 'segment'>();
    const {year, month} = useSelector(selectDates);
    const [currentYear] = useState(new Date().getFullYear().toString());
    const [currentMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const fastError = useSelector(selectFastError);
    const slowError = useSelector(selectSlowError);
    const divisionsLoaded = useSelector(selectDivisionsLoaded);

    const [sorted, setSorted] = useState(
        pace.map(row => paceRow<CustomerPaceRow>(slowPace, customerKey)(row))
            .sort(customerPaceSorter(sort))
    );
    const [total, setTotal] = useState(zeroTotal);

    const sortChangeHandler = (field: keyof CustomerPaceRow) => {
        if (sort.field === field) {
            return dispatch(setSort({...sort, ascending: !sort.ascending}));
        }
        dispatch(setSort({field, ascending: true}));
    }

    useEffect(() => {
        const sorted = pace
            .filter(row => row.ARDivisionNo === arDivisionNo)
            .filter(row => !segment || row.Segment === segment)
            .map(row => paceRow<CustomerPaceRow>(slowPace, customerKey)(row))
            .sort(customerPaceSorter(sort));
        const total = sorted.reduce(paceReducer, zeroTotal);
        setSorted(sorted);
        setTotal(total);
    }, [pace, arDivisionNo, segment, sort, loaded]);

    useEffect(() => {
        if (!valid) {
            return;
        }
        if (!divisionsLoaded) {
            dispatch(loadByDivision({year, month}));
        }
        dispatch(loadCustomers({year, month, ARDivisionNo: arDivisionNo}));
        if (currentYear === year && currentMonth === month) {
            dispatch(slowLoadCustomers({year, month, ARDivisionNo: arDivisionNo}));
        }
    }, [valid, arDivisionNo]);

    return (
        <div className="mt-5">
            {!!fastError && <Alert variant="error">{fastError}</Alert>}
            {!!slowError && <Alert variant="error">Slow Pace: {slowError}</Alert>}
            <div>
                <Table size="small">
                    <thead>
                    <tr style={{fontWeight: 700, fontSize: '1rem', color: 'var(--bs-body-color)'}}>
                        {fields.map((field, index) => (
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
                    {sorted.map(row => (
                        <tr key={customerKey(row)}>
                            {fields.map((field, index) => (
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
            </div>
        </div>
    )
}

export default PaceByCustomer;
