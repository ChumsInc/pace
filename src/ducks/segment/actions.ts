import {createAsyncThunk} from "@reduxjs/toolkit";
import {PaceArgs, SegmentPaceResponse, SlowPace, SlowPacePayload, SlowSegmentPaceRow} from "../../types";
import {fetchBySegment, fetchSlowBySegment} from "../../api/by-segment";
import {RootState} from "../../app/configureStore";
import Decimal from "decimal.js";
import {selectSegmentsList} from "../segment-list";
import {segmentKey} from "./utils";

export const loadBySegment = createAsyncThunk<SegmentPaceResponse, PaceArgs>(
    'by-segment/load',
    async (arg) => {
        const {pace} = await fetchBySegment(arg.year, arg.month, arg.ARDivisionNo);
        return {
            pace,
            timestamp: new Date().toISOString(),
        }
    }
)

export const slowLoadBySegment = createAsyncThunk<SlowPacePayload<SlowSegmentPaceRow>, PaceArgs>(
    'by-segment/slow-load',
    async (arg, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const segments = selectSegmentsList(state);
        const response: SlowPace<SlowSegmentPaceRow> = {}

        const {invoiced, currentInvoiced} = await fetchSlowBySegment(arg.year, arg.month);

        invoiced?.forEach(row => {
            const segment = segments[row.Segment ?? '']?.ReportAsType ?? row.Segment;
            const key = segmentKey({...row, Segment: segment});
            if (!response[key]) {
                response[key] = {...row, InvoiceTotal: 0};
            }
            response[key].InvoiceTotal = new Decimal(response[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        })

        currentInvoiced?.forEach(row => {
            const segment = segments[row.Segment ?? 'NONE']?.ReportAsType ?? row.Segment ?? 'NONE';
            const key = segmentKey({...row, Segment: segment});
            if (!response[key]) {
                response[key] = {...row, InvoiceTotal: 0};
            }
            response[key].InvoiceTotal = new Decimal(response[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        });
        return {
            invoiced: response,
            timestamp: new Date().toISOString(),
        };
    }
)
