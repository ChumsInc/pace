import {generatePath, Link, useParams} from "react-router";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {divisionPath} from "@/app/constants";
import {selectDivisions} from "@/ducks//division";
import {selectSegmentsList} from "../segment-list";
import {useAppSelector} from "@/app/configureStore.ts";

export default function PaceBreadcrumbs() {
    const {arDivisionNo, segment} = useParams<'arDivisionNo' | 'segment'>()
    const divisions = useAppSelector(selectDivisions);
    const segments = useAppSelector(selectSegmentsList);

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
