import type {CustomerPaceRow} from "@/src/types.ts";
import {customerKey} from "@/ducks/customer/utils.ts";
import type {SortableTableField} from "@chumsinc/sortable-tables";
import CustomerLink from "@/ducks/customer/CustomerLink.tsx";
import classNames from "classnames";
import Decimal from "decimal.js";
import {numeralFormat} from "@/app/constants.ts";
import numeral from "numeral";

export const customerFields: SortableTableField<CustomerPaceRow>[] = [
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
