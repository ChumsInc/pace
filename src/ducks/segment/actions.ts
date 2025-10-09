import {createAsyncThunk} from "@reduxjs/toolkit";
import type {PaceArgs, SegmentPaceResponse, SlowPace, SlowPacePayload, SlowSegmentPaceRow} from "../../types";
import {fetchBySegment, fetchSlowBySegment} from "../../api/by-segment";
import type {RootState} from "@/app/configureStore";
import Decimal from "decimal.js";
import {selectSegmentsList} from "../segment-list";
import {segmentKey} from "./utils";
import {selectFastPaceStatus, selectSlowPaceStatus} from "./index";
import {idleStates} from "@/app/constants.ts";
import {selectProfileValid} from "@/ducks/profile";

export const loadBySegment = createAsyncThunk<SegmentPaceResponse, PaceArgs>(
    'by-segment/load',
    async (arg) => {
        const {pace} = await fetchBySegment(arg.year, arg.month, arg.ARDivisionNo, arg.refresh);
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

export const slowLoadBySegment = createAsyncThunk<SlowPacePayload<SlowSegmentPaceRow>, PaceArgs>(
    'by-segment/slow-load',
    async (arg, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const segments = selectSegmentsList(state);
        const invoiced: SlowPace<SlowSegmentPaceRow> = {}

        const result = await fetchSlowBySegment(arg.year, arg.month);

        result.invoiced?.forEach(row => {
            const segment = segments[row.Segment ?? '']?.ReportAsType ?? row.Segment;
            const key = segmentKey({...row, Segment: segment});
            if (!invoiced[key]) {
                invoiced[key] = {...row, InvoiceTotal: 0};
            }
            invoiced[key].InvoiceTotal = new Decimal(invoiced[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        })

        result.currentInvoiced?.forEach(row => {
            const segment = segments[row.Segment ?? 'NONE']?.ReportAsType ?? row.Segment ?? 'NONE';
            const key = segmentKey({...row, Segment: segment});
            if (!invoiced[key]) {
                invoiced[key] = {...row, InvoiceTotal: 0};
            }
            invoiced[key].InvoiceTotal = new Decimal(invoiced[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        });
        return {
            invoiced: Object.values(invoiced),
            timestamp: result.timestamp,
        };
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
