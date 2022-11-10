import React from 'react';

export interface PaceAsOfDateProps {
    updated: string|null;
}

const PaceAsOfDate = ({updated}:PaceAsOfDateProps) => {
    if (!updated) {
        return null;
    }
    return (
        <span className="text-muted">Last Updated: {new Date(updated).toLocaleString()}</span>
    )
}

export default PaceAsOfDate;
