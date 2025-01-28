import {CustomerPaceRow, PaceState, SlowCustomerPaceRow, SlowPace} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadCustomers, setSort, slowLoadCustomers} from "./actions";
import {customerKey} from "./utils";
import {SortProps} from "chums-types";
import {customerPaceSorter} from "../../utils";

export interface CustomerState extends PaceState {
    pace: CustomerPaceRow[];
    slowPace: SlowPace<SlowCustomerPaceRow>;
    sort: SortProps<CustomerPaceRow>
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
            ].sort(customerPaceSorter({field: "CustomerNo", ascending: true}));
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
            // remove any remaining customers from other divisions;
            const remainingSlowPace: SlowPace<SlowCustomerPaceRow> = {};
            Object.values(state.slowPace)
                .filter(row => row.ARDivisionNo !== action.meta.arg.ARDivisionNo)
                .forEach(row => {
                    remainingSlowPace[customerKey(row)] = row;
                });

            // add to pace any customers that came in via slow pace.
            const customers = state.pace.map(row => customerKey(row));
            Object.values(action.payload.invoiced)
                .filter(row => !customers.includes(customerKey(row)))
                .forEach(row => {
                    state.pace.push({...row, InvoiceTotal: 0, PrevOpenOrderTotal: 0, HeldOrderTotal: 0, OpenOrderTotal: 0, Pace: 0})
                });

            state.pace = [...state.pace].sort(customerPaceSorter({field: "CustomerNo", ascending: true}))
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
