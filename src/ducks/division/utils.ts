import {DivisionPaceRow, PaceRow} from "../../types";
import Decimal from "decimal.js";

export const paceTotal = (pace: PaceRow, invoiced?: number | string): Decimal => {
    return new Decimal(invoiced ?? pace.InvoiceTotal)
        .add(pace.OpenOrderTotal)
        .add(pace.PrevOpenOrderTotal)
        .add(pace.HeldOrderTotal)
}

export const divisionPaceKey = (row:DivisionPaceRow) => row.ARDivisionNo;
