import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadByDivision, slowLoadByDivision} from "@/ducks/division/actions.ts";
import {loadCustomers, slowLoadCustomers} from "@/ducks/customer/actions.ts";
import {loadBySegment, slowLoadBySegment} from "@/ducks/segment/actions.ts";

export interface AppState {
    year: string;
    month: string;
    updated: null | string;
}

export const initialAppState: AppState = {
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    updated: null,
}

const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setYear: (state, action: PayloadAction<string>) => {
            state.year = action.payload;
        },
        setMonth: (state, action: PayloadAction<string>) => {
            state.month = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadByDivision.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
            .addCase(slowLoadByDivision.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
            .addCase(loadCustomers.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
            .addCase(slowLoadCustomers.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
            .addCase(loadBySegment.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
            .addCase(slowLoadBySegment.fulfilled, (state, action) => {
                state.updated = action.payload.timestamp;
            })
    },
    selectors: {
        selectYear: (state) => state.year,
        selectMonth: (state) => state.month,
        selectUpdated: (state) => state.updated,
    }
})

export const {setYear, setMonth} = appSlice.actions;
export const {selectYear, selectMonth, selectUpdated} = appSlice.selectors;

export const selectDates = createSelector(
    [selectYear, selectMonth],
    (year, month) => ({year, month})
);

export const selectShouldLoadSlowPace = createSelector(
    [selectYear, selectMonth],
    (year, month) => {
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentYear === year && currentMonth === month
    }
)

export default appSlice;
