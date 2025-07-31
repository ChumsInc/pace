import React from "react";
import {Link} from "react-router";
export interface DivisionLinkProps {
    arDivisionNo: string;
    children: React.ReactNode
}
export default function DivisionLink({arDivisionNo, children}:DivisionLinkProps) {
    return (
        <Link to={`/${arDivisionNo}`}>{children}</Link>
    );
}
