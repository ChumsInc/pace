import React, {CSSProperties, HTMLAttributes} from 'react';
import {PaceRow} from "../types";
import Decimal from "decimal.js";
import NumericTD from "./NumericTD";
import numeral from "numeral";
import Button from 'react-bootstrap/Button'
import styled from "styled-components";

const ProgressTableRow = styled.tr({
    '--bs-table-bg': 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left bottom',
    backgroundImage: `linear-gradient(90deg, transparent, var(--bs-border-color))`,
    backgroundSize: '0',
    transition: 'background-size ease-in-out',
})

export interface PaceRowProps {
    link: React.ReactNode;
    description: React.ReactNode;
    pace: PaceRow;
    goal?: number | string;
    showPercent?: boolean;
    toggled?: boolean;
    onToggle?: () => void;
    trProps?: HTMLAttributes<HTMLTableRowElement>,
    progress?: number;
}

const PaceTR = ({
                    link,
                    description,
                    pace,
                    goal,
                    showPercent,
                    toggled,
                    onToggle,
                    trProps,
                    progress
                }: PaceRowProps) => {
    const {style, ...otherProps} = trProps ?? {};
    const progressStyle: CSSProperties = {
        backgroundSize: `${Math.min(Math.max(progress ?? 0,0), 1) * 100}% 5px`,
        ...style,
    }

    return (
        <ProgressTableRow style={progressStyle} {...otherProps}>
            <td>
                {!!onToggle && (
                    <Button aria-label="expand row" type="button" size="sm" onClick={onToggle}
                            variant="link">
                        {toggled ? <span className="bi-chevron-bar-up"/> : <span className="bi-chevron-down"/>}
                    </Button>
                )}
            </td>
            <td>{link}</td>
            <td>{description}</td>
            <NumericTD value={pace.InvoiceTotal}/>
            <NumericTD value={pace.OpenOrderTotal}/>
            <NumericTD value={pace.PrevOpenOrderTotal}/>
            <NumericTD value={pace.HeldOrderTotal}/>
            <NumericTD value={pace.Pace}/>
            {goal !== undefined && Number(goal) !== 0 && (<NumericTD value={goal}/>)}
            {goal !== undefined && Number(goal) === 0 && (<td/>)}
            {showPercent && (
                <td align="right">
                    {goal !== undefined && Number(goal) !== 0 && (
                        <span>
                            {numeral(new Decimal(pace.Pace).div(goal).toString()).format('0,0.0%')}
                        </span>
                    )}
                </td>
            )}
            {showPercent && !goal && (
                <td align="right"/>
            )}
            {!showPercent && goal !== undefined && Number(goal) === 0 && (<td align="right"/>)}
        </ProgressTableRow>
    )
}

export default PaceTR;
