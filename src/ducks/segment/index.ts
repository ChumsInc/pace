import type {PaceState, PaceType, SegmentPaceRow} from "../../types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadBySegment, slowLoadBySegment} from "./actions";
import {segmentKey} from "@/ducks/segment/utils.ts";
import type {SortProps} from "chums-types";
import {zeroTotal} from "@/src/utils.ts";

const adapter = createEntityAdapter<SegmentPaceRow, string>({
    selectId: (arg) => segmentKey(arg),
    sortComparer: (a, b) => segmentKey(a).localeCompare(segmentKey(b))
});

const selectors = adapter.getSelectors();


export type BySegmentState = PaceState<SegmentPaceRow>;

export const initialBySegmentState: BySegmentState = {
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

const segmentSlice = createSlice({
    name: 'segment',
    initialState: adapter.getInitialState(initialBySegmentState),
    reducers: {
        dismissAlert: (state, action: PayloadAction<PaceType>) => {
            state.errors[action.payload] = null;
            state.status[action.payload] = 'idle';
        },
        setSort: (state, action: PayloadAction<SortProps<SegmentPaceRow>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadBySegment.pending, (state, action) => {
                if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                    adapter.removeAll(state);
                }
                state.year = action.meta.arg.year;
                state.month = action.meta.arg.month;
                state.status.fast = 'loading';
            })
            .addCase(loadBySegment.fulfilled, (state, action) => {
                adapter.setMany(state, action.payload.pace);
                state.status.fast = 'fulfilled';
                state.updated = action.payload.timestamp;
            })
            .addCase(loadBySegment.rejected, (state, action) => {
                state.status.fast = 'rejected';
                state.errors.fast = action.error?.message ?? null;
            })
            .addCase(slowLoadBySegment.pending, (state) => {
                state.status.slow = 'loading';
            })
            .addCase(slowLoadBySegment.fulfilled, (state, action) => {
                state.status.slow = 'fulfilled';
                action.payload.invoiced.forEach(row => {
                    const value = selectors.selectById(state, segmentKey(row));
                    if (!value) {
                        adapter.addOne(state, {...zeroTotal, Description: '', ...row})
                    } else {
                        adapter.updateOne(state, {id: segmentKey(row), changes: {InvoiceTotal: row.InvoiceTotal}})
                    }
                })
            })
            .addCase(slowLoadBySegment.rejected, (state, action) => {
                state.status.slow = 'rejected';
                state.errors.slow = action.error?.message ?? null;
            })
    },
    selectors: {
        selectFastPaceStatus: (state) => state.status.fast,
        selectFastPaceError: (state) => state.errors.fast,
        selectSlowPaceStatus: (state) => state.status.slow,
        selectSlowPaceError: (state) => state.errors.slow,
        selectSegmentsLastUpdated: (state) => state.updated,
        selectSort: (state) => state.sort,
        selectPace: (state) => selectors.selectAll(state),
    }
});

export default segmentSlice;

export const {dismissAlert, setSort} = segmentSlice.actions;
export const {
    selectFastPaceStatus,
    selectFastPaceError,
    selectSlowPaceStatus,
    selectSlowPaceError,
    selectSegmentsLastUpdated,
    selectSort,
    selectPace,
} = segmentSlice.selectors;

export const selectSegmentsPaceLoading = createSelector(
    [selectFastPaceStatus],
    (fast) => {
        return fast === 'loading';
    }
)
