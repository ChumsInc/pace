import React from 'react';
import classNames from "classnames";
import numeral from "numeral";
import {numeralFormat} from "../app/constants";
import Decimal from "decimal.js";
import TableCell, {TableCellProps} from '@mui/material/TableCell';

export interface NumericTDProps {
    value: string|number|Decimal;
    format?: string;
    tdProps?: TableCellProps,
}
const NumericTD = ({value, format, tdProps}:NumericTDProps) => {
    const _value = new Decimal(value);
    return (
        <TableCell align="right" className={classNames({'text-muted': _value.eq(0), 'text-danger': _value.lt(0)})} {...tdProps}>
            {numeral(_value.toString()).format(format ?? numeralFormat)}
        </TableCell>
    )
}

export default NumericTD;
