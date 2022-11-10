import {CustomerPaceRow, CustomerSort, PaceState, SlowCustomerPaceRow, SlowPace} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadCustomers, setSort, slowLoadCustomers} from "./actions";
import {customerKey} from "./utils";

export interface CustomerState extends PaceState {
    pace: CustomerPaceRow[];
    slowPace: SlowPace<SlowCustomerPaceRow>;
    sort: CustomerSort
}

const initialState: CustomerState = {
    year: null,
    month: null,
    pace: [],
    slowPace: {},
    loaded: null,
    fastLoading: false,
    slowLoading: false,
    fastError: null,
    slowError: null,
    sort: {
        field: 'PrevOpenOrderTotal',
        ascending: true,
    }
}

const customerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadCustomers.pending, (state) => {
            state.fastLoading = true;
        })
        .addCase(loadCustomers.fulfilled, (state, action) => {
            state.fastLoading = false;
            state.fastError = null;
            state.pace = [
                ...state.pace.filter(row => row.ARDivisionNo !== action.meta.arg.ARDivisionNo),
                ...(action.payload.pace || [])
            ];
            state.loaded = action.payload.timestamp;
        })
        .addCase(loadCustomers.rejected, (state, action) => {
            state.fastLoading = false;
            state.fastError = action.error?.message ?? null;
        })
        .addCase(slowLoadCustomers.pending, (state) => {
            state.slowLoading = true;
        })
        .addCase(slowLoadCustomers.fulfilled, (state, action) => {
            state.slowLoading = false;
            // remove
            const remainingSlowPace: SlowPace<SlowCustomerPaceRow> = {};
            Object.values(state.slowPace).filter(row => row.ARDivisionNo !== action.meta.arg.ARDivisionNo)
                .forEach(row => {
                    remainingSlowPace[customerKey(row)] = row;
                });
            state.slowPace = {...remainingSlowPace, ...action.payload.invoiced};
            state.loaded = action.payload.timestamp;
        })
        .addCase(slowLoadCustomers.rejected, (state, action) => {
            state.slowLoading = false;
            state.slowError = action.error?.message ?? null;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
        })
})

export default customerReducer;
