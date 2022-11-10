import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectFastPaceLoading = (state: RootState) => state.segment.fastLoading;
export const selectSlowPaceLoading = (state: RootState) => state.segment.slowLoading;

export const selectSegmentsPaceLoading = createSelector(
    [selectFastPaceLoading, selectSlowPaceLoading],
    (fast, slow) => fast || slow
)

export const selectLoaded = (state: RootState) => state.segment.loaded;

export const selectPace = (state: RootState) => state.segment.pace;
export const selectSlowPace = (state: RootState) => state.segment.slowPace;


export const selectFastError = (state: RootState) => state.segment.fastError;
export const selectSlowError = (state: RootState) => state.segment.slowError;
