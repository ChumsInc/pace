import type {CustomerPaceRow, PaceState} from "../../types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadCustomers, slowLoadCustomers} from "./actions";
import {customerKey} from "./utils";
import type {SortProps} from "chums-types";
import {customerPaceSorter, zeroTotal} from "@/src/utils.ts";


const adapter = createEntityAdapter<CustomerPaceRow, string>({
    selectId: (arg) => customerKey(arg),
    sortComparer: (a, b) => customerKey(a).localeCompare(customerKey(b))
})
const selectors = adapter.getSelectors();


export type CustomerState = PaceState<CustomerPaceRow>

const extraState: CustomerState = {
    year: null,
    month: null,
    status: {
        fast: 'idle',
        slow: 'idle'
    },
    errors: {
        fast: null,
        slow: null,
    },
    updated: null,
    sort: {
        field: 'PrevOpenOrderTotal',
        ascending: true,
    }
}

const customerSlice = createSlice({
    name: "customer",
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<CustomerPaceRow>>) => {
            state.sort = action.payload;
        },
        dismissError: (state, action: PayloadAction<'fast' | 'slow'>) => {
            state.errors[action.payload] = null;
            state.status[action.payload] = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCustomers.pending, (state) => {
                state.status.fast = 'loading';
            })
            .addCase(loadCustomers.fulfilled, (state, action) => {
                state.status.fast = 'fulfilled';
                state.errors.fast = null;
                adapter.setAll(state, action.payload.pace);
                state.updated = action.payload.timestamp;
            })
            .addCase(loadCustomers.rejected, (state, action) => {
                state.status.fast = 'rejected';
                state.errors.fast = action.error?.message ?? null;
            })
            .addCase(slowLoadCustomers.pending, (state) => {
                state.status.slow = 'loading';
            })
            .addCase(slowLoadCustomers.fulfilled, (state, action) => {
                state.status.slow = 'fulfilled';
                action.payload.invoiced.forEach(row => {
                    const value = selectors.selectById(state, customerKey(row));
                    if (!value) {
                        adapter.addOne(state, {...zeroTotal, ...row})
                    } else {
                        adapter.updateOne(state, {id: customerKey(row), changes: {InvoiceTotal: row.InvoiceTotal}})
                    }
                })
                state.updated = action.payload.timestamp;
            })
            .addCase(slowLoadCustomers.rejected, (state, action) => {
                state.status.slow = 'rejected';
                state.errors.slow = action.error?.message ?? null;
            })
    },
    selectors: {
        selectFastPaceStatus: (state) => state.status.fast,
        selectFastPaceError: (state) => state.errors.fast,
        selectSlowPaceStatus: (state) => state.status.slow,
        selectSlowPaceError: (state) => state.errors.slow,
        selectCustomersLastUpdated: (state) => state.updated,
        selectSort: (state) => state.sort,
        selectPace: (state) => selectors.selectAll(state),
    }
});

export const {setSort, dismissError} = customerSlice.actions;
export const {
    selectFastPaceStatus,
    selectFastPaceError,
    selectSlowPaceError,
    selectSlowPaceStatus,
    selectSort,
    selectCustomersLastUpdated,
    selectPace,
} = customerSlice.selectors;

export const selectCustomerPaceLoading = createSelector(
    [selectFastPaceStatus],
    (fast) => fast === 'loading'
)

export const selectSortedPace = createSelector(
    [selectPace, selectSort],
    (pace, sort) => {
        return [...pace].sort(customerPaceSorter(sort))
    }
)

export default customerSlice;
