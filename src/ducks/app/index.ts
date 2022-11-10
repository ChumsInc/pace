import {createAction, createReducer, createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";

export interface AppState {
    year:string;
    month:string;
}

export const initialAppState:AppState = {
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
}

export const setYear = createAction<string>('app/setYear');
export const setMonth = createAction<string>('app/setMonth');

export const selectYear = (state:RootState) => state.app.year;
export const selectMonth = (state:RootState) => state.app.month;
export const selectDates = createSelector(
    [selectYear, selectMonth],
    (year, month) => ({year, month})
)

const appReducer = createReducer(initialAppState, (builder) => {
    builder
        .addCase(setYear, (state, action) => {
            state.year = action.payload;
        })
        .addCase(setMonth, (state, action) => {
            state.month = action.payload;
        })
});

export default appReducer;
