import {useSelector} from "react-redux";
import {selectDivisions} from "@/ducks//division";
import {selectSegmentsList} from "../segment-list";
import {useParams} from "react-router";

export default function CustomerTitle() {
    const divisions = useSelector(selectDivisions);
    const segments = useSelector(selectSegmentsList);
    const {arDivisionNo, segment} = useParams<'arDivisionNo' | 'segment'>();
    const [currentDivision] = divisions.filter(row => row.ARDivisionNo === arDivisionNo);
    const currentSegment = segments[segment ?? ''];

    return (
        <div>
            {currentDivision && <h2>{currentDivision.ARDivisionNo} / {currentDivision?.ARDivisionDesc}</h2>}
            {currentSegment && <h3>{currentSegment.Description ?? currentSegment.CustomerType}</h3>}
        </div>
    )
}

