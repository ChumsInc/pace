import React from 'react';

const friendlyDate = (d:Date|string|number) => {
    const date = new Date(d);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString();
    }
    return d.toLocaleString();
}
export interface PaceAsOfDateProps {
    updated: string|null;
}

const PaceAsOfDate = ({updated}:PaceAsOfDateProps) => {
    if (!updated) {
        return null;
    }
    return (
        <span className="text-muted"><span className="d-none d-md-inline">Last Updated:</span>  {friendlyDate(new Date(updated))}</span>
    )
}

export default PaceAsOfDate;
