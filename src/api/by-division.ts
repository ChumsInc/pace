import {DivisionPaceResponse, SlowPaceResponse} from "../types";
import {fetchJSON} from "chums-ui-utils";

const paceByDivisionURL = '/api/sales/pace/chums/:year-:month';
const slowPaceByDivisionURL = '/sage/api/pace/by-division.php';

export async function fetchByDivision(year: string, month: string): Promise<DivisionPaceResponse> {
    try {
        const url = paceByDivisionURL
            .replace(':year', encodeURIComponent(year))
            .replace(':month', encodeURIComponent(month));
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

        const url = `${slowPaceByDivisionURL}?${query.toString()}`;
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
