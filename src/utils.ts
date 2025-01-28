import Decimal from "decimal.js";
import {CustomerPaceRow, PaceRow, SegmentPaceRow, SlowPace, SlowPaceRow} from "./types";
import {customerKey} from "./ducks/customer/utils";
import {SortProps} from "chums-types";

export const paceReducer = (pv: PaceRow, cv: PaceRow) => {
    return {
        InvoiceTotal: new Decimal(pv.InvoiceTotal).add(cv.InvoiceTotal).toString(),
        PrevOpenOrderTotal: new Decimal(pv.PrevOpenOrderTotal).add(cv.PrevOpenOrderTotal).toString(),
        OpenOrderTotal: new Decimal(pv.OpenOrderTotal).add(cv.OpenOrderTotal).toString(),
        HeldOrderTotal: new Decimal(pv.HeldOrderTotal).add(cv.HeldOrderTotal).toString(),
        Pace: new Decimal(pv.Pace).add(cv.Pace).toString(),
        goal: new Decimal(pv.goal ?? 0).add(cv.goal ?? 0).toString(),
    }
}

export const paceRow = <T extends PaceRow>(slowPace: SlowPace<SlowPaceRow>, keyFn: (row: T) => string) => (row: T): T => {
    return {
        ...row,
        InvoiceTotal: slowPace[keyFn(row)]?.InvoiceTotal ?? row.InvoiceTotal,
        Pace: new Decimal(slowPace[keyFn(row)]?.InvoiceTotal ?? row.InvoiceTotal)
            .add(row.OpenOrderTotal).add(row.PrevOpenOrderTotal).add(row.HeldOrderTotal).toString(),
    }
}


export const customerPaceSorter = (sort: SortProps<CustomerPaceRow>) => (a: CustomerPaceRow, b: CustomerPaceRow): number => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'CustomerNo':
        case 'CustomerName':
            return (
                a[field].toLowerCase() === b[field].toLowerCase()
                    ? (customerKey(a) > customerKey(b) ? 1 : -1)
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)

            ) * sortMod;
        case 'InvoiceTotal':
        case 'OpenOrderTotal':
        case 'PrevOpenOrderTotal':
        case 'HeldOrderTotal':
        case 'Pace':
            return (
                new Decimal(a[field]).eq(b[field])
                    ? (
                        new Decimal(a.Pace).eq(b.Pace)
                            ? (customerKey(a) > customerKey(b) ? 1 : -1)
                            : (new Decimal(a.Pace).gt(b.Pace) ? 1 : -1)
                    )
                    : (new Decimal(a[field]).gt(b[field]) ? 1 : -1)
            ) * -sortMod;
        default:
            return customerKey(a) > customerKey(b) ? 1 : -1;
    }
}

export const zeroTotal: PaceRow = {
    InvoiceTotal: 0,
    PrevOpenOrderTotal: 0,
    OpenOrderTotal: 0,
    HeldOrderTotal: 0,
    Pace: 0,
    goal: 0,
}
