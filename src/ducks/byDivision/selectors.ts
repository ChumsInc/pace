import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {PaceRow} from "../../types";
import Decimal from "decimal.js";
import {getSlowCurrentInvoiced, getSlowInvoiced} from "./utils";


export const selectFastPaceLoading = (state:RootState) => state.byDivision.fastLoading;
export const selectSlowPaceLoading = (state:RootState) => state.byDivision.slowLoading;

export const selectPaceLoading = createSelector(
    [selectFastPaceLoading, selectSlowPaceLoading],
    (fast, slow) => fast || slow
)

export const selectLoaded = (state:RootState) => state.byDivision.loaded;

export const selectPace = (state:RootState) => state.byDivision.pace;
export const selectSlowPace = (state:RootState) => state.byDivision.slowPace;

export const selectPaceTotal = createSelector(
    [selectPace, selectSlowPace],
    (pace, slowPace) => {
        const total:PaceRow = {
            InvoiceTotal: 0,
            CurrentInvoiceTotal: 0,
            PrevOpenOrderTotal: 0,
            OpenOrderTotal: 0,
            HeldOrderTotal: 0,
            goal: 0,
        }
        return pace
            .filter(row => row.ARDivisionNo !== '10')
            .reduce((pv, cv) => {
                return {
                    InvoiceTotal: new Decimal(pv.InvoiceTotal).add(getSlowInvoiced(slowPace, cv.ARDivisionNo) ?? cv.InvoiceTotal).toString(),
                    CurrentInvoiceTotal: new Decimal(pv.CurrentInvoiceTotal).add(getSlowCurrentInvoiced(slowPace, cv.ARDivisionNo) ?? cv.CurrentInvoiceTotal).toString(),
                    PrevOpenOrderTotal: new Decimal(pv.PrevOpenOrderTotal).add(cv.PrevOpenOrderTotal).toString(),
                    OpenOrderTotal: new Decimal(pv.OpenOrderTotal).add(cv.OpenOrderTotal).toString(),
                    HeldOrderTotal: new Decimal(pv.HeldOrderTotal).add(cv.HeldOrderTotal).toString(),
                    goal: new Decimal(pv.goal ?? 0).add(cv.goal ?? 0).toString(),
                }
            }, total);
    }
)

export const selectFastError = (state:RootState) => state.byDivision.fastError;
export const selectSlowError = (state:RootState) => state.byDivision.slowError;
