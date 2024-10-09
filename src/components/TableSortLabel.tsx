import React from 'react';
import Stack from "react-bootstrap/Stack";
import classNames from "classnames";

function SortIcon({direction, align}: {
    direction: 'asc' | 'desc';
    align?: 'start' | 'center' | 'end';
}) {
    const className = classNames({
        'ms-1': align === 'end',
        'me-1': align !== 'end'
    })
    return (
        <div className={className}><span className={direction === 'asc' ? "bi-arrow-up" : "bi-arrow-down"}/></div>
    )
}

export interface TableSortLabelProps {
    active: boolean;
    direction: 'asc' | 'desc';
    iconBefore?: boolean;
    align?: 'start' | 'center' | 'end';
    onClick: () => void;
    children: React.ReactNode;
}

export default function TableSortLabel({
                                           active,
                                           direction,
                                           iconBefore,
                                           align,
                                           onClick,
                                           children,
                                       }: TableSortLabelProps) {
    return (
        <Stack direction="horizontal" onClick={onClick} style={{cursor: 'pointer'}}>
            {active && iconBefore && (<SortIcon direction={direction} align={align}/>)}
            <div className={align === 'end' ? 'ms-auto' : ''}>{children}</div>
            {active && !iconBefore && (<SortIcon direction={direction} align={align}/>)}
        </Stack>
    )
}
