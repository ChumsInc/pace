import React from 'react';
import {generatePath, Link as RoutedLink, useParams} from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {divisionPath} from "../../app/constants";
import Typography from "@mui/material/Typography";
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
        <Breadcrumbs sx={{alignItems: 'center'}}>
            {!!currentDivision && (
                <Link underline="hover" sx={{display: 'flex', alignItems: 'center'}} component={RoutedLink} to="/">
                    CHUMS Pace
                </Link>
            )}
            {!!currentDivision && !currentSegment && (
                <Typography
                    color="text.primary">[{currentDivision.ARDivisionNo}] {currentDivision.ARDivisionDesc} </Typography>
            )}
            {!!currentDivision && !!currentSegment && (
                <Link underline="hover" sx={{display: 'flex', alignItems: 'center'}} component={RoutedLink}
                      to={generatePath(divisionPath, {arDivisionNo: currentDivision.ARDivisionNo})}>
                    [{currentDivision.ARDivisionNo}] {currentDivision.ARDivisionDesc}
                </Link>
            )}
            {!!currentSegment && (
                <Typography
                    color="text.primary">[{currentSegment.CustomerType}] {currentSegment.Description}</Typography>
            )}
        </Breadcrumbs>
    )
}

export default PaceBreadcrumbs
