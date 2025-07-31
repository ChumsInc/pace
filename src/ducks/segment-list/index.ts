import type {SegmentList} from "../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchSegments} from "../../api/by-segment";
import type {RootState} from "@/app/configureStore";

export interface SegmentsState {
    list: SegmentList;
    loading: boolean;
    loaded: boolean;
    error?: string;
}

export const initialSegmentState: SegmentsState = {
    list: {},
    loading: false,
    loaded: false,
}

const segmentListSlice = createSlice({
    name: 'segments',
    initialState: initialSegmentState,
    reducers: {},
    extraReducers: (builder) => {
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

    },
    selectors: {
        selectSegmentsList: (state) => state.list,
        selectSegmentsLoading: (state) => state.loading,
        selectSegmentsLoaded: (state) => state.loaded,
    }
})

export default segmentListSlice;
export const {selectSegmentsList, selectSegmentsLoading, selectSegmentsLoaded} = segmentListSlice.selectors;

export const loadSegments = createAsyncThunk<SegmentList, void, { state: RootState }>(
    'segment-list/load',
    async () => {
        return await fetchSegments();
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return !selectSegmentsLoading(state);
        }
    }
)

