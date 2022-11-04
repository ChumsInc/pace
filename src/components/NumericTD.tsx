import React from 'react';
import classNames from "classnames";
import numeral from "numeral";
import {numeralFormat} from "../app/constants";
import Decimal from "decimal.js";

export interface NumericTDProps {
    value: string|number|Decimal;
    format?: string;
}
const NumericTD = ({value, format}:NumericTDProps) => {
    const _value = new Decimal(value);
    return (
        <td className={classNames("text-end", {'text-muted': _value.eq(0), 'text-danger': _value.lt(0)})}>
            {numeral(_value.toString()).format(format ?? numeralFormat)}
        </td>
    )
}

export default NumericTD;
