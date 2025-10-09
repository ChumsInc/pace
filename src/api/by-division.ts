import type {DivisionPaceResponse, SlowPaceResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchByDivision(year: string, month: string, refresh?: boolean): Promise<DivisionPaceResponse> {
    try {
        const params = new URLSearchParams();
        params.set('year', year);
        params.set('month', month);
        if (refresh) {
            params.set('refresh', '1')
        }
        const url = `/api/sales/pace/chums.json?${params.toString()}`;
        const response = await fetchJSON<DivisionPaceResponse>(url);
        if (!response || response.error) {
            return Promise.reject(new Error(response?.error ?? 'Unable to load division pace'));
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

export async function fetchSlowByDivision(year: string, month: string): Promise<SlowPaceResponse> {
    try {
        const query = new URLSearchParams();
        query.set('year', year);
        query.set('month', Number(month).toString());

        const url = `/sage/api/pace/by-division.php?${query.toString()}`;
        const response = await fetchJSON<SlowPaceResponse>(url);
        if (!response || response.error) {
            return Promise.reject(new Error(response?.error ?? 'Unable to load division pace (slow)'));
        }
        return response;

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSlowByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlowByDivision()", err);
        return Promise.reject(new Error('Error in fetchSlowByDivision()'));
    }
}
