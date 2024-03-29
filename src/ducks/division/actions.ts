import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {DivisionPaceResponse, PaceArgs, SlowDivisionPaceRow, SlowPace, SlowPacePayload} from "../../types";
import {fetchByDivision, fetchSlowByDivision} from "../../api/by-division";
import Decimal from "decimal.js";
import {RootState} from "../../app/configureStore";
import {selectFastPaceLoading, selectSlowPaceLoading} from "./selectors";

export const loadByDivision = createAsyncThunk<DivisionPaceResponse, PaceArgs>(
    'by-division/load',
    async (arg) => {
        const {pace = []} = await fetchByDivision(arg.year, arg.month);
        return {
            pace,
            timestamp: new Date().toISOString(),
        }
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectFastPaceLoading(state);
        }
    }
)

export const slowLoadByDivision = createAsyncThunk<SlowPacePayload<SlowDivisionPaceRow>, PaceArgs>(
    'by-division/slow-load',
    async (arg) => {
        const {invoiced, currentInvoiced} = await fetchSlowByDivision(arg.year, arg.month);
        const slowPace: SlowPace<SlowDivisionPaceRow> = {};
        invoiced?.forEach(row => {
            slowPace[row.ARDivisionNo] = row;
        });
        currentInvoiced?.forEach(row => {
            if (!slowPace[row.ARDivisionNo]) {
                slowPace[row.ARDivisionNo] = {ARDivisionNo: row.ARDivisionNo, InvoiceTotal: 0};
            }
            slowPace[row.ARDivisionNo].InvoiceTotal = new Decimal(slowPace[row.ARDivisionNo]?.InvoiceTotal ?? 0).add(row.InvoiceTotal).toString();
        });
        return {
            invoiced: slowPace,
            timestamp: new Date().toISOString(),
        }
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSlowPaceLoading(state);
        }
    }
)

export const toggleExpanded = createAction<string>('by-division/toggle-expanded');
