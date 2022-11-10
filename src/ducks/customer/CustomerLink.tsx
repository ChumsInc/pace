import React from 'react';
import {CustomerPaceRow} from "../../types";

export interface CustomerLinkProps {
    pace:CustomerPaceRow;
    children: React.ReactNode;
}

const CustomerLink = ({pace, children}:CustomerLinkProps) => {
    const url = '/reports/account/orderhistory';
    const params = new URLSearchParams();
    params.set('company', 'chums');
    params.set('customer', [pace.ARDivisionNo, pace.CustomerNo].join('-'));
    const href = url + '?' + params.toString();

    return (
        <a href={href} target="_blank">{children}</a>
    )
}

export default React.memo(CustomerLink);
