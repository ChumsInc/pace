import dayjs from "dayjs";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectUpdated} from "@/ducks/app";

const PaceAsOfDate = () => {
    const updated = useAppSelector(selectUpdated);
    if (!updated) {
        return null;
    }
    return (
        <div>
            <span className="me-3 text-secondary"> Last Updated:</span>
            <span>{dayjs(updated).format('hh:mm a')}</span>
        </div>
    )
}

export default PaceAsOfDate;
