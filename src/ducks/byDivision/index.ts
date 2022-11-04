import {DivisionPaceRow, SlowPaceResponse} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadByDivision, slowLoadByDivision} from "./actions";


export interface ByDivisionState {
    year: string | null;
    month: string | null;
    pace: DivisionPaceRow[];
    slowPace: SlowPaceResponse;
    loaded: string | null;
    fastLoading: boolean;
    slowLoading: boolean;
    fastError: string|null;
    slowError: string|null;
}

export const initialByDivisionState: ByDivisionState = {
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


const byDivisionReducer = createReducer(initialByDivisionState, (builder) => {
    builder
        .addCase(loadByDivision.pending, (state, action) => {
            if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                state.pace = [];
                state.slowPace = {};
            }
            state.year = action.meta.arg.year;
            state.month = action.meta.arg.month;
            state.fastLoading = true;
            state.fastError = null;
        })
        .addCase(loadByDivision.fulfilled, (state, action) => {
            state.pace = action.payload ?? [];
            state.fastLoading = false;
            state.fastError = null;
            state.loaded = new Date().toISOString();
        })
        .addCase(loadByDivision.rejected, (state, action) => {
            state.fastLoading = false;
            state.fastError = action.error?.message ?? null;
        })
        .addCase(slowLoadByDivision.pending, (state, action) => {
            if (action.meta.arg.year !== state.year || action.meta.arg.month !== state.month) {
                state.slowPace = {};
            }
            state.slowLoading = true;
            state.slowError = null;
        })
        .addCase(slowLoadByDivision.fulfilled, (state, action) => {
            state.slowPace = action.payload ?? {}
            state.slowLoading = false;
            state.loaded = new Date().toISOString();
        })
        .addCase(slowLoadByDivision.rejected, (state, action) => {
            state.slowError = action.error?.message ?? null;
        })
})

export default byDivisionReducer;
