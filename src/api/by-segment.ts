import {Segment, SegmentList, SegmentPaceResponse, SlowPaceResponse, SlowSegmentPaceRow} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";


const paceBySegmentURL = '/api/sales/pace/chums/:year-:month/:ARDivisionNo/segment';
const slowPaceBySegmentURL = '/sage/api/pace/by-segment.php';

export async function fetchSegments(): Promise<SegmentList> {
    try {
        const segments = await fetchJSON<Segment[]>('/api/sales/customer-types');
        const list: SegmentList = {};
        segments
            .forEach(row => {
                if (row.CustomerType) {
                    list[row.CustomerType] = row;
                }
            });
        return list;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSegments()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSegments()", err);
        return Promise.reject(new Error('Error in fetchSegments()'));
    }
}

export async function fetchBySegment(year: string, month: string, ARDivisionNo: string = '%'): Promise<SegmentPaceResponse> {
    try {
        const url = paceBySegmentURL
            .replace(':year', encodeURIComponent(year))
            .replace(':month', encodeURIComponent(month))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo));
        return await fetchJSON<SegmentPaceResponse>(url);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchByDivision()", err);
        return Promise.reject(new Error('Error in fetchByDivision()'));
    }

}

export async function fetchSlowBySegment(year: string, month: string): Promise<SlowPaceResponse<SlowSegmentPaceRow>> {
    try {
        const query = new URLSearchParams();
        query.set('year', year);
        query.set('month', Number(month).toString());

        const url = `${slowPaceBySegmentURL}?${query.toString()}`;
        return await fetchJSON<SlowPaceResponse<SlowSegmentPaceRow>>(url);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSlowByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlowByDivision()", err);
        return Promise.reject(new Error('Error in fetchSlowByDivision()'));
    }
}

