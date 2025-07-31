import type {UserValidationResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchUserValidation():Promise<UserValidationResponse> {
    try {
        const url = '/api/user/validate.json';
        const response = await fetchJSON<UserValidationResponse>(url);
        if (!response) {
            return Promise.reject(new Error('Unable to load validate user'));
        }
        return response;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchUserValidation()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchUserValidation()", err);
        return Promise.reject(new Error('Error in fetchUserValidation()'));
    }
}
