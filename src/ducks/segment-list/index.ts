import {SegmentList} from "../../types";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchSegments} from "../../api/by-segment";
import {RootState} from "../../app/configureStore";

export interface SegmentsState {
    list: SegmentList;
    loading: boolean;
    loaded: boolean;
    error?: string;
}

export const initialSegmentState:SegmentsState = {
    list: {},
    loading: false,
    loaded: false,
}

export const selectSegmentsList = (state:RootState) => state.segments.list;
export const selectSegmentsLoading = (state:RootState) => state.segments.loading;
export const selectSegmentsLoaded = (state:RootState) => state.segments.loaded;

export const loadSegments = createAsyncThunk<SegmentList>(
    'segment-list/load',
    async () => {
        return await fetchSegments();
    }
)

const segmentsReducer = createReducer(initialSegmentState, (builder) => {
    builder
        .addCase(loadSegments.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadSegments.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload;
        })
        .addCase(loadSegments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
});

export default segmentsReducer;
