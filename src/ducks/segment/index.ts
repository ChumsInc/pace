import {PaceState, SegmentPaceRow, SlowPace, SlowSegmentPaceRow} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadBySegment, slowLoadBySegment} from "./actions";


export interface BySegmentState extends PaceState {
    pace: SegmentPaceRow[],
    slowPace: SlowPace<SlowSegmentPaceRow>
}

export const initialBySegmentState: BySegmentState = {
    year: null,
    month: null,
    pace: [],
    slowPace: {},
    loaded: null,
    fastLoading: false,
    slowLoading: false,
    fastError: null,
    slowError: null,
}

const segmentReducer = createReducer(initialBySegmentState, (builder) => {
    builder
        .addCase(loadBySegment.pending, (state, action) => {
            if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                state.pace = [];
                state.slowPace = {};
            }
            state.year = action.meta.arg.year;
            state.month = action.meta.arg.month;
            state.fastLoading = true;
            state.fastError = null;
        })
        .addCase(loadBySegment.fulfilled, (state, action) => {
            state.pace = action.payload.pace ?? [];
            state.loaded = action.payload.timestamp;
            state.fastLoading = false;
            state.fastError = null;
        })
        .addCase(loadBySegment.rejected, (state, action) => {
            state.fastLoading = false;
            state.fastError = action.error?.message ?? null;
        })
        .addCase(slowLoadBySegment.pending, (state, action) => {
            if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                state.slowPace = {};
            }
            state.slowLoading = true;
            state.slowError = null;
        })
        .addCase(slowLoadBySegment.fulfilled, (state, action) => {
            state.slowPace = action.payload.invoiced;
            state.loaded = action.payload.timestamp;
            state.slowLoading = false;
        })
        .addCase(slowLoadBySegment.rejected, (state, action) => {
            state.slowError = action.error?.message ?? null;
            state.slowLoading = false;
        })
})

export default segmentReducer;
