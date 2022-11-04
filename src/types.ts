import Decimal from "decimal.js";

export interface PaceRow {
    InvoiceTotal: string|number;
    CurrentInvoiceTotal: string|number;
    PrevOpenOrderTotal: string|number;
    OpenOrderTotal: string|number;
    HeldOrderTotal: string|number;
    budget?: string|number;
    goal?: string|number;
}

export interface DivisionPaceRow extends PaceRow {
    ARDivisionNo: string;
    ARDivisionDesc: string;
}

export interface PaceResponse {
    pace?: DivisionPaceRow[];
    error?: string;
}

export interface SlowPaceResponse {
    invoiced?: {
        [key:string]: number;
    };
    currentInvoiced?: {
        [key:string]: number;
    };
    error?: string;
}


export interface PaceArgs {
    year: string;
    month: string;
    ARDivisionNo?: string;
    Segment?: string;
    CustomerNo?:string;
}

export interface Month {
    value: string;
    name: string;
}
