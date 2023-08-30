import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectFastError, selectCustomersLoaded, selectPace, selectSlowError, selectSlowPace, selectSort} from "./selectors";
import {customerPaceSorter, paceReducer, paceRow, zeroTotal} from "../../utils";
import {useParams} from "react-router-dom";
import {customerKey} from "./utils";
import {CustomerPaceRow} from "../../types";
import {SortableTableField} from "chums-components/dist/types";
import {loadCustomers, setSort, slowLoadCustomers} from "./actions";
import numeral from "numeral";
import {numeralFormat} from "../../app/constants";
import {selectDates} from "../app";
import classNames from "classnames";
import Decimal from "decimal.js";
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell, {TableCellProps} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from "@mui/material/TableFooter";
import TableSortLabel from '@mui/material/TableSortLabel';
import Alert from "@mui/material/Alert";
import CustomerLink from "./CustomerLink";
import {selectProfileValid} from "../profile";
import {selectDivisionsLoaded} from "../division/selectors";
import {loadByDivision} from "../division/actions";

interface CustomerTableField extends SortableTableField<CustomerPaceRow> {
    cellProps?: TableCellProps,
}

const fields: CustomerTableField[] = [
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
        cellProps: {align: 'right'},
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.InvoiceTotal).lt(0)}),
        render: (row) => numeral(row.InvoiceTotal).format(numeralFormat)
    },
    {
        field: 'OpenOrderTotal',
        title: 'Open Orders',
        sortable: true,
        cellProps: {align: 'right'},
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.OpenOrderTotal).lt(0)}),
        render: (row) => numeral(row.OpenOrderTotal).format(numeralFormat)
    },
    {
        field: 'PrevOpenOrderTotal',
        title: 'Prev Open',
        sortable: true,
        cellProps: {align: 'right'},
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.PrevOpenOrderTotal).lt(0)}),
        render: (row) => numeral(row.PrevOpenOrderTotal).format(numeralFormat)
    },
    {
        field: 'HeldOrderTotal',
        title: 'On Hold',
        sortable: true,
        cellProps: {align: 'right'},
        className: (row) => classNames('text-end', {'text-danger': new Decimal(row.HeldOrderTotal).lt(0)}),
        render: (row) => numeral(row.HeldOrderTotal).format(numeralFormat)
    },
    {
        field: 'Pace',
        title: 'Pace',
        sortable: true,
        cellProps: {align: 'right'},
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
            {!!fastError && <Alert severity="error">{fastError}</Alert>}
            {!!slowError && <Alert severity="error">Slow Pace: {slowError}</Alert>}
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{'& > th': {fontWeight: 700, fontSize: '1rem', color: 'var(--bs-body-color)'}}}>
                            {fields.map((row, index) => (
                                <TableCell key={index} {...row.cellProps}>
                                    <TableSortLabel
                                        active={sort.field === row.field}
                                        direction={sort.field === row.field ? (sort.ascending ? 'asc' : 'desc') : 'asc'}
                                        onClick={() => sortChangeHandler(row.field)}>
                                        {row.title}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.map(row => (
                            <TableRow key={customerKey(row)}>
                                {fields.map((field, index) => (
                                    <TableCell key={index} {...field.cellProps}>
                                        {!!field.render && (
                                            <>{field.render(row)}</>
                                        )}
                                        {!field.render && (
                                            <>{row[field.field]}</>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow sx={{'& > td': {fontWeight: 700, fontSize: '1rem', color: 'var(--bs-body-color)'}}}>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{numeral(total.InvoiceTotal).format(numeralFormat)}</TableCell>
                            <TableCell align="right">{numeral(total.OpenOrderTotal).format(numeralFormat)}</TableCell>
                            <TableCell
                                align="right">{numeral(total.PrevOpenOrderTotal).format(numeralFormat)}</TableCell>
                            <TableCell align="right">{numeral(total.HeldOrderTotal).format(numeralFormat)}</TableCell>
                            <TableCell align="right">{numeral(total.Pace).format(numeralFormat)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    )
}

export default PaceByCustomer;
