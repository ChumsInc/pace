import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {DivisionPaceResponse, PaceArgs, SlowDivisionPaceRow, SlowPace, SlowPacePayload} from "../../types";
import {fetchByDivision, fetchSlowByDivision} from "../../api/by-division";
import Decimal from "decimal.js";
import type {RootState} from "@/app/configureStore";
import {selectFastPaceStatus, selectSlowPaceStatus} from "./index";
import {idleStates} from "@/app/constants.ts";
import {selectProfileValid} from "@/ducks/profile";

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
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            const valid = selectProfileValid(state);
            const status = selectFastPaceStatus(state);
            return valid && idleStates.includes(status);
        }
    }
)

export const slowLoadByDivision = createAsyncThunk<SlowPacePayload<SlowDivisionPaceRow>, PaceArgs>(
    'by-division/slow-load',
    async (arg) => {
        const response = await fetchSlowByDivision(arg.year, arg.month);
        const invoiced: SlowPace<SlowDivisionPaceRow> = {};
        response?.invoiced?.forEach(row => {
            invoiced[row.ARDivisionNo] = row;
        });
        response?.currentInvoiced?.forEach(row => {
            if (!invoiced[row.ARDivisionNo]) {
                invoiced[row.ARDivisionNo] = {ARDivisionNo: row.ARDivisionNo, InvoiceTotal: 0};
            }
            invoiced[row.ARDivisionNo].InvoiceTotal = new Decimal(invoiced[row.ARDivisionNo]?.InvoiceTotal ?? 0).add(row.InvoiceTotal).toString();
        });
        return {
            invoiced: Object.values((invoiced)),
            timestamp: new Date().toISOString(),
        }
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            const valid = selectProfileValid(state);
            const status = selectSlowPaceStatus(state);
            return valid && idleStates.includes(status);
        }
    }
)

export const toggleExpanded = createAction<string>('by-division/toggle-expanded');
