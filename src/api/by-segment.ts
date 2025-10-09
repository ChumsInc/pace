import type {Segment, SegmentList, SegmentPaceResponse, SlowPaceResponse, SlowSegmentPaceRow} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";


export async function fetchSegments(): Promise<SegmentList> {
    try {
        const segments = await fetchJSON<Segment[]>('/api/sales/customer-types.json');
        const list: SegmentList = {};
        segments?.forEach(row => {
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
        const params = new URLSearchParams();
        params.set('year', year);
        params.set('month', month);
        const url = `/api/sales/pace/:ARDivisionNo/segment.json?${params.toString()}`
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo));
        const response = await fetchJSON<SegmentPaceResponse>(url);
        if (!response || response.error) {
            return Promise.reject(new Error(response?.error ?? 'Unable to load segment pace'));
        }
        return response;

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

        const url = `/sage/api/pace/by-segment.php?${query.toString()}`;
        const response = await fetchJSON<SlowPaceResponse<SlowSegmentPaceRow>>(url);
        if (!response || response.error) {
            return Promise.reject(new Error(response?.error ?? 'Unable to load customer pace'));
        }
        return {
            ...response,
            timestamp: new Date().toISOString()
        };

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSlowByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlowByDivision()", err);
        return Promise.reject(new Error('Error in fetchSlowByDivision()'));
    }
}

