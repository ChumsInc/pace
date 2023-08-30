import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {Division} from "../../types";


export const selectFastPaceLoading = (state: RootState) => state.division.fastLoading;
export const selectSlowPaceLoading = (state: RootState) => state.division.slowLoading;

export const selectPaceLoading = createSelector(
    [selectFastPaceLoading, selectSlowPaceLoading],
    (fast, slow) => fast || slow
)

export const selectDivisionsLoaded = (state: RootState) => state.division.loaded;

export const selectPace = (state: RootState) => state.division.pace;
export const selectSlowPace = (state: RootState) => state.division.slowPace;
export const selectExpanded = (state: RootState) => state.division.expanded;

export const selectFastError = (state: RootState) => state.division.fastError;
export const selectSlowError = (state: RootState) => state.division.slowError;

export const selectDivisions = createSelector(
    [selectPace],
    (pace) => {
        return pace.map(div => {
            const {ARDivisionNo, ARDivisionDesc} = div;
            return {
                ARDivisionNo,
                ARDivisionDesc
            } as Division
        })
    }
)
