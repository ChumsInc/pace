import React from 'react';
import {generatePath, Link, useParams} from "react-router";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {divisionPath} from "../../app/constants";
import {useSelector} from "react-redux";
import {selectDivisions} from "../division/selectors";
import {selectSegmentsList} from "../segment-list";

const PaceBreadcrumbs = () => {
    const {arDivisionNo, segment} = useParams<'arDivisionNo' | 'segment'>()
    const divisions = useSelector(selectDivisions);
    const segments = useSelector(selectSegmentsList);

    const [currentDivision] = divisions.filter(row => row.ARDivisionNo === arDivisionNo);
    const currentSegment = segments[segment ?? ''];


    return (
        <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: '/'}}>CHUMS Pace</Breadcrumb.Item>
            {!!currentDivision && !currentSegment && (
                <Breadcrumb.Item active>
                    [{currentDivision.ARDivisionNo}] {currentDivision.ARDivisionDesc}
                </Breadcrumb.Item>
            )}
            {!!currentDivision && !!currentSegment && (
                <Breadcrumb.Item linkAs={Link}
                                 linkProps={{to: generatePath(divisionPath, {arDivisionNo: currentDivision.ARDivisionNo})}}>
                    [{currentDivision.ARDivisionNo}] {currentDivision.ARDivisionDesc}
                </Breadcrumb.Item>
            )}
            {!!currentSegment && (
                <Breadcrumb.Item active>[{currentSegment.CustomerType}] {currentSegment.Description}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

export default PaceBreadcrumbs
