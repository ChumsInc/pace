import {UserProfile} from "chums-types";

export interface Month {
    value: string;
    name: string;
}

export interface PaceArgs {
    year: string;
    month: string;
    ARDivisionNo?: string;
    Segment?: string;
    CustomerNo?: string;
}

export interface DivisionKey {
    ARDivisionNo: string;
}

export interface SegmentKey {
    ARDivisionNo: string;
    Segment: string | null;
}

export interface CustomerKey {
    ARDivisionNo: string;
    CustomerNo: string;
}

export interface Division extends DivisionKey {
    ARDivisionDesc: string;
}

export interface SlowPaceResponse<T = SlowDivisionPaceRow> {
    invoiced?: T[];
    currentInvoiced?: T[];
    timestamp: string;
    error?: string;
}

export interface SlowPace<T = any> {
    [key: string]: T;
}

export interface SlowPacePayload<T = any> {
    invoiced: SlowPace<T>,
    timestamp: string;
}

export interface PaceRow {
    InvoiceTotal: string | number;
    PrevOpenOrderTotal: string | number;
    OpenOrderTotal: string | number;
    HeldOrderTotal: string | number;
    Pace: string | number;
    budget?: string | number;
    goal?: string | number;
}

export interface SlowPaceRow {
    InvoiceTotal: string | number;
}

export interface PaceState {
    year: string | null;
    month: string | null;
    pace: unknown[];
    slowPace: SlowPace<unknown>;
    loaded: string | null;
    fastLoading: boolean;
    slowLoading: boolean;
    fastError: string | null;
    slowError: string | null;
}

export interface DivisionPaceRow extends DivisionKey, PaceRow {
    ARDivisionDesc: string;
}

export interface SlowDivisionPaceRow extends DivisionKey, SlowPaceRow {
}

export interface DivisionPaceResponse {
    pace: DivisionPaceRow[];
    timestamp: string;
    error?: string;
}

export interface SegmentPaceRow extends SegmentKey, PaceRow {
    Description: string | null;
}

export interface SlowSegmentPaceRow extends SegmentKey, SlowPaceRow {
}

export interface SegmentPaceResponse {
    pace: SegmentPaceRow[];
    timestamp: string;
    error?: string;
}


export interface Segment {
    CustomerType: string | null;
    ReportAsType: string | null
    Description: string | null;
    customerCount: number;
}

export interface SegmentList {
    [key: string]: Segment;
}

export interface CustomerPaceRow extends CustomerKey, PaceRow {
    CustomerName: string;
    Segment: string | null;
}


export interface CustomerPaceResponse {
    pace: CustomerPaceRow[];
    timestamp: string;
    error?: string;
}

export interface SlowCustomerPaceRow extends CustomerKey, SlowPaceRow {
    CustomerName: string;
    Segment: string | null;
}

export interface UserValidationResponse {
    valid?: boolean;
    profile?: UserProfile;
    roles?: boolean;
    loaded: string;
}
