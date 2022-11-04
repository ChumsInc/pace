import React from 'react';
import {PaceRow} from "../types";
import Decimal from "decimal.js";
import numeral from "numeral";
import {numeralFormat} from "../app/constants";
import classNames from "classnames";
import NumericTD from "./NumericTD";

export interface PaceRowProps {
    link: React.ReactNode;
    description: string;
    pace: PaceRow;
    goal?: number | string;
    invoiced?: number | string;
    current?: number | string;
    toggled?: boolean;
    onToggle?: () => void
}

const PaceTR = ({link, description, pace, goal, invoiced, current, toggled, onToggle}: PaceRowProps) => {
    const _invoiced = new Decimal(invoiced ?? pace.InvoiceTotal).add(current ?? pace.CurrentInvoiceTotal);
    const _pace = new Decimal(invoiced ?? pace.InvoiceTotal).add(current ?? pace.CurrentInvoiceTotal)
        .add(pace.OpenOrderTotal).add(pace.PrevOpenOrderTotal).add(pace.HeldOrderTotal);
    return (
        <tr>
            {onToggle !== undefined && (<td><span className={classNames({'bi-caret-right': !toggled, 'bi-cart-down-fill': toggled})} /></td>)}
            <td>{link}</td>
            <td>{description}</td>
            <NumericTD value={_invoiced} />
            <NumericTD value={pace.OpenOrderTotal} />
            <NumericTD value={pace.PrevOpenOrderTotal} />
            <NumericTD value={pace.HeldOrderTotal} />
            <NumericTD value={_pace} />
            {goal !== undefined && (<NumericTD value={goal} />)}
        </tr>
    )
}

export default PaceTR;
