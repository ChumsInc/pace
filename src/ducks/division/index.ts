import type {Division, DivisionPaceRow, PaceState} from "../../types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadByDivision, slowLoadByDivision} from "./actions";
import {localStorageKeys} from "../../api/preferences";
import {LocalStore} from "@chumsinc/ui-utils";
import type {SortProps} from "chums-types";
import {paceReducer, zeroTotal} from "@/src/utils.ts";

const adapter = createEntityAdapter<DivisionPaceRow, string>({
    selectId: (arg) => arg.ARDivisionNo,
    sortComparer: (a, b) => a.ARDivisionNo.localeCompare(b.ARDivisionNo),
})

const selectors = adapter.getSelectors();


export interface ByDivisionState extends PaceState<DivisionPaceRow> {
    expanded: {
        [key: string]: boolean;
    }
}

export const extraState: ByDivisionState = {
    year: null,
    month: null,
    status: {
        fast: 'idle',
        slow: 'idle',
    },
    errors: {
        fast: null,
        slow: null,
    },
    updated: null,
    expanded: {
        ...LocalStore.getItem(localStorageKeys.divisionExpanded, {})
    },
    sort: {
        field: 'ARDivisionNo',
        ascending: true,
    }
}

const divisionSlice = createSlice({
    name: 'division',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<DivisionPaceRow>>) => {
            state.sort = action.payload;
        },
        toggleExpanded: (state, action: PayloadAction<string>) => {
            state.expanded[action.payload] = !state.expanded[action.payload];
        },
        dismissError: (state, action: PayloadAction<'fast' | 'slow'>) => {
            state.errors[action.payload] = null;
            state.status[action.payload] = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadByDivision.pending, (state, action) => {
                if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                    adapter.removeAll(state);
                }
                state.year = action.meta.arg.year;
                state.month = action.meta.arg.month;
                state.status.fast = 'loading';
                state.errors.fast = null;
            })
            .addCase(loadByDivision.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload.pace);
                state.status.fast = 'fulfilled';
            })
            .addCase(loadByDivision.rejected, (state, action) => {
                state.status.fast = 'rejected';
                state.errors.fast = action.error?.message ?? null;
            })
            .addCase(slowLoadByDivision.pending, (state) => {
                state.status.slow = 'loading';
                state.errors.slow = null;
            })
            .addCase(slowLoadByDivision.fulfilled, (state, action) => {
                state.status.slow = 'fulfilled';
                action.payload.invoiced.map(row => {
                    const value = selectors.selectById(state, row.ARDivisionNo);
                    if (!value) {
                        adapter.addOne(state, {...zeroTotal, ARDivisionDesc: '', ...row})
                    } else {
                        adapter.updateOne(state, {id: row.ARDivisionNo, changes: {InvoiceTotal: row.InvoiceTotal}})
                    }
                })
                state.updated = action.payload.timestamp;
            })
            .addCase(slowLoadByDivision.rejected, (state, action) => {
                state.status.slow = 'rejected';
                state.errors.slow = action.error?.message ?? null;
            });
    },
    selectors: {
        selectFastPaceStatus: (state) => state.status.fast,
        selectFastPaceError: (state) => state.errors.fast,
        selectSlowPaceStatus: (state) => state.status.slow,
        selectSlowPaceError: (state) => state.errors.slow,
        selectDivisionsLastUpdated: (state) => state.updated,
        selectSort: (state) => state.sort,
        selectPace: (state) => selectors.selectAll(state),
        selectExpanded: (state) => state.expanded,
    }
})

export default divisionSlice;

export const {setSort, toggleExpanded, dismissError} = divisionSlice.actions;
export const {
    selectFastPaceStatus,
    selectSlowPaceStatus,
    selectFastPaceError,
    selectSlowPaceError,
    selectPace,
    selectDivisionsLastUpdated,
    selectSort,
    selectExpanded
} = divisionSlice.selectors;


export const selectDivisionPaceLoading = createSelector(
    [selectFastPaceStatus],
    (fast) => fast === 'loading'
)

export const selectDivisions = createSelector(
    [selectPace],
    (pace): Division[] => {
        return pace.map(div => {
            const {ARDivisionNo, ARDivisionDesc} = div;
            return {
                ARDivisionNo,
                ARDivisionDesc
            }
        })
    }
)

export const selectPaceTotal = createSelector(
    [selectPace],
    (pace) => {
        return pace
            .filter(row => row.ARDivisionNo !== '10')
            .reduce(paceReducer, zeroTotal);
    }
)
