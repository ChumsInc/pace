import React from 'react';
import {FormControl} from "react-bootstrap";

const friendlyDate = (d:Date|string|number) => {
    const date = new Date(d);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString();
    }
    return d.toLocaleString();
}

const PaceAsOfDate = ({updated}:PaceAsOfDateProps) => {
    if (!updated) {
        return null;
    }
    return (
        <FormControl plaintext readOnly defaultValue={`Last Updated: ${friendlyDate(updated)}`}  />
    )
}

export default PaceAsOfDate;

export interface PaceAsOfDateProps {
    updated: string|null;
}
