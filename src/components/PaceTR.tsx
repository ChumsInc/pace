import React from 'react';
import {PaceRow} from "../types";
import Decimal from "decimal.js";
import NumericTD from "./NumericTD";
import numeral from "numeral";
import TableCell from '@mui/material/TableCell';
import TableRow, {TableRowProps} from '@mui/material/TableRow';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


export interface PaceRowProps {
    link: React.ReactNode;
    description: React.ReactNode;
    pace: PaceRow;
    goal?: number | string;
    showPercent?: boolean;
    toggled?: boolean;
    onToggle?: () => void;
    trProps?: TableRowProps
}

const PaceTR = ({
                    link,
                    description,
                    pace,
                    goal,
                    showPercent,
                    toggled,
                    onToggle,
                    trProps
                }: PaceRowProps) => {
    return (
        <TableRow {...trProps}>
            <TableCell>
                {!!onToggle && (
                    <IconButton aria-label="expand row" size="small" onClick={onToggle}>
                        {toggled ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                )}
            </TableCell>
            <TableCell>{link}</TableCell>
            <TableCell>{description}</TableCell>
            <NumericTD value={pace.InvoiceTotal}/>
            <NumericTD value={pace.OpenOrderTotal}/>
            <NumericTD value={pace.PrevOpenOrderTotal}/>
            <NumericTD value={pace.HeldOrderTotal}/>
            <NumericTD value={pace.Pace}/>
            {goal !== undefined && Number(goal) !== 0 && (<NumericTD value={goal}/>)}
            {goal !== undefined && Number(goal) === 0 && (<TableCell/>)}
            {showPercent && goal !== undefined && Number(goal) !== 0 && (
                <TableCell className="text-end">
                    {numeral(new Decimal(pace.Pace).div(goal).toString()).format('0,0.0%')}
                </TableCell>
            )}
            {!showPercent && goal !== undefined && Number(goal) === 0 && (<TableCell align="right"/>)}
        </TableRow>
    )
}

export default PaceTR;
