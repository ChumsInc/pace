import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectPace} from "./index";
import PaceTR from "../../components/PaceTR";
import {segmentKey} from "./utils";
import {selectSegmentsList} from "../segment-list";
import {generatePath, Link} from "react-router";
import {segmentPath} from "@/app/constants";

export interface SegmentLinkProps {
    arDivisionNo: string,
    segment: string,
    children: React.ReactNode
}

const SegmentLink = ({arDivisionNo, segment, children}: SegmentLinkProps) => (
    <Link to={generatePath(segmentPath, {arDivisionNo, segment})}>{children}</Link>
);

export interface SegmentRowsProps {
    arDivisionNo: string;
}

const SegmentRows = ({arDivisionNo}: SegmentRowsProps) => {
    const pace = useSelector(selectPace);
    const segments = useSelector(selectSegmentsList);
    const [filtered, setFiltered] = useState(pace.filter(row => row.ARDivisionNo === arDivisionNo));

    useEffect(() => {
        setFiltered(pace.filter(row => row.ARDivisionNo === arDivisionNo));
    }, [arDivisionNo, pace])

    return (
        <>
            {filtered.map((row, index) => (
                <PaceTR key={segmentKey(row)}
                        link={(
                            <SegmentLink arDivisionNo={row.ARDivisionNo} segment={row.Segment ?? 'NONE'}>
                                {row.ARDivisionNo}/{row.Segment ?? 'NONE'}
                            </SegmentLink>
                        )}
                        description={(
                            <SegmentLink arDivisionNo={row.ARDivisionNo} segment={row.Segment ?? 'NONE'}>
                                {segments[row.Segment ?? '']?.Description ?? 'Unassigned'}
                            </SegmentLink>
                        )}
                        pace={row}
                        goal=""
                        trProps={{
                            className: `pace--${filtered.length}-${index} py-1`,
                            style: {borderBottomWidth: (filtered.length - 1) === index ? undefined : 0}
                        }}
                />
            ))}
        </>
    )
}
export default SegmentRows;
