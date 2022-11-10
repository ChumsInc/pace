import {CustomerPaceResponse, SlowCustomerPaceRow, SlowPaceResponse} from "../types";
import {fetchJSON} from "chums-components/dist/fetch";


const paceByCustomerURL = '/api/sales/pace/chums/:year-:month/:ARDivisionNo/customer';
const slowPaceByCustomerURL = '/sage/api/pace/by-customer.php';

export async function fetchByCustomer(year: string, month: string, ARDivisionNo: string): Promise<CustomerPaceResponse> {
    try {
        const url = paceByCustomerURL
            .replace(':year', encodeURIComponent(year))
            .replace(':month', encodeURIComponent(month))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo));
        return await fetchJSON<CustomerPaceResponse>(url);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchByCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchByCustomer()", err);
        return Promise.reject(new Error('Error in fetchByCustomer()'));
    }

}

export async function fetchSlowByCustomer(year: string, month: string, ARDivisionNo: string): Promise<SlowPaceResponse<SlowCustomerPaceRow>> {
    try {
        const query = new URLSearchParams();
        query.set('year', year);
        query.set('month', month);
        query.set('ARDivisionNo', ARDivisionNo);

        const url = `${slowPaceByCustomerURL}?${query.toString()}`;
        return await fetchJSON<SlowPaceResponse<SlowCustomerPaceRow>>(url);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSlowByCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlowByCustomer()", err);
        return Promise.reject(new Error('Error in fetchSlowByCustomer()'));
    }
}

