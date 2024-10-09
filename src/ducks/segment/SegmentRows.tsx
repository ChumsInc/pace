import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectLoaded, selectPace, selectSegmentsPaceLoading, selectSlowPace} from "./selectors";
import {loadBySegment, slowLoadBySegment} from "./actions";
import {selectMonth, selectYear} from "../app";
import PaceTR from "../../components/PaceTR";
import {segmentKey} from "./utils";
import {selectSegmentsList} from "../segment-list";
import {generatePath, Link} from "react-router-dom";
import {segmentPath} from "../../app/constants";
import {selectProfileValid} from "../profile";
import {paceRow} from "../../utils";
import {SegmentPaceRow} from "../../types";

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
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectSegmentsPaceLoading);
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);
    const pace = useSelector(selectPace);
    const slowPace = useSelector(selectSlowPace);
    const segments = useSelector(selectSegmentsList);
    const [currentYear] = useState(new Date().getFullYear().toString());
    const [currentMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [filtered, setFiltered] = useState(
        pace.filter(row => row.ARDivisionNo === arDivisionNo)
            .map(row => paceRow<SegmentPaceRow>(slowPace, segmentKey)(row))
    );

    useEffect(() => {
        if (!valid) {
            return;
        }
        if (!loaded && !loading) {
            dispatch(loadBySegment({year, month}));
            if (currentYear === year && currentMonth === month) {
                dispatch(slowLoadBySegment({year, month}))
            }
        }
    }, []);

    useEffect(() => {
        setFiltered(pace.filter(row => row.ARDivisionNo === arDivisionNo));
    }, [loaded, arDivisionNo])

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
