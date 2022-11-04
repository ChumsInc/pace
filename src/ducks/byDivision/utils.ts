import {PaceRow, SlowPaceResponse} from "../../types";
import Decimal from "decimal.js";

export const paceTotal = (pace:PaceRow, invoiced?: number|string, current?: number|string):Decimal => {
    return new Decimal(invoiced ?? pace.InvoiceTotal).add(current ?? pace.CurrentInvoiceTotal)
        .add(pace.OpenOrderTotal).add(pace.PrevOpenOrderTotal).add(pace.HeldOrderTotal)
}

export const getSlowInvoiced = (slowPace:SlowPaceResponse, key:string):string|number|undefined => {
    if (slowPace?.invoiced) {
        return slowPace.invoiced[key];
    }
}

export const getSlowCurrentInvoiced = (slowPace:SlowPaceResponse, key:string):string|number|undefined => {
    if (slowPace?.currentInvoiced) {
        return slowPace.currentInvoiced[key];
    }
}
