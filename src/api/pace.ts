import {DivisionPaceRow, PaceResponse, SlowPaceResponse} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";

const paceByDivisionURL = '/api/sales/pace/chums/:year/:month';
const slowPaceByDivisionURL = '/node-sage/api/CHI/pace/invoiced/:year/:month';


export async function fetchByDivision(year:string, month:string):Promise<DivisionPaceRow[]> {
    try {
        const url = paceByDivisionURL
            .replace(':year', encodeURIComponent(year))
            .replace(':month', encodeURIComponent(month));
        const {pace} = await fetchJSON<PaceResponse>(url);
        return pace ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchByDivision()", err);
        return Promise.reject(new Error('Error in fetchByDivision()'));
    }

}

export async function fetchSlowByDivision(year:string, month: string):Promise<SlowPaceResponse> {
    try {
        const url = slowPaceByDivisionURL
            .replace(':year', encodeURIComponent(year))
            .replace(':month', encodeURIComponent(month));
        return await fetchJSON<SlowPaceResponse>(url);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSlowByDivision()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlowByDivision()", err);
        return Promise.reject(new Error('Error in fetchSlowByDivision()'));
    }
}

