import {DivisionPaceRow, PaceState, SlowDivisionPaceRow, SlowPace} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadByDivision, slowLoadByDivision, toggleExpanded} from "./actions";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";


export interface ByDivisionState extends PaceState {
    pace: DivisionPaceRow[];
    slowPace: SlowPace<SlowDivisionPaceRow>;
    expanded: {
        [key: string]: boolean;
    }
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
    expanded: {
        ...getPreference(localStorageKeys.divisionExpanded, {})
    }
}


const divisionReducer = createReducer(initialByDivisionState, (builder) => {
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
            state.pace = action.payload.pace ?? [];
            state.loaded = action.payload.timestamp;
            state.fastLoading = false;
            state.fastError = null;
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
            state.slowPace = action.payload.invoiced;
            state.loaded = action.payload.timestamp;
            state.slowLoading = false;
            state.slowError = null;
        })
        .addCase(slowLoadByDivision.rejected, (state, action) => {
            state.slowLoading = false;
            state.slowError = action.error?.message ?? null;
        })
        .addCase(toggleExpanded, (state, action) => {
            state.expanded[action.payload] = !state.expanded[action.payload];
            setPreference(localStorageKeys.divisionExpanded, state.expanded);
        })
})

export default divisionReducer;
