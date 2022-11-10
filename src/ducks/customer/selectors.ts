import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectFastPaceLoading = (state: RootState) => state.customer.fastLoading;
export const selectSlowPaceLoading = (state: RootState) => state.customer.slowLoading;
export const selectCustomerPaceLoading = createSelector(
    [selectFastPaceLoading, selectSlowPaceLoading],
    (fast, slow) => fast || slow
)

export const selectCustomersLoaded = (state: RootState) => state.customer.loaded;

export const selectPace = (state: RootState) => state.customer.pace;
export const selectSlowPace = (state: RootState) => state.customer.slowPace;

export const selectFastError = (state: RootState) => state.customer.fastError;
export const selectSlowError = (state: RootState) => state.customer.slowError;

export const selectSort = (state:RootState) => state.customer.sort;
