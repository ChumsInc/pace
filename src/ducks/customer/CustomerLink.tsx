import React from 'react';
import type {CustomerPaceRow} from "../../types";

export interface CustomerLinkProps {
    pace:CustomerPaceRow;
    children: React.ReactNode;
}

export default function CustomerLink({pace, children}:CustomerLinkProps) {
    return (
        <a href={orderHistoryUrl(pace)} target="_blank" rel="noreferrer">{children}</a>
    )
}

function orderHistoryUrl({ARDivisionNo, CustomerNo}:CustomerPaceRow) {
    const params = new URLSearchParams();
    params.set('company', 'chums');
    params.set('customer', [ARDivisionNo, CustomerNo].join('-'));
    return `/reports/account/orderhistory?${params.toString()}`;
}
