import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
    CustomerPaceResponse,
    CustomerSort,
    PaceArgs,
    SlowCustomerPaceRow,
    SlowPace,
    SlowPacePayload
} from "../../types";
import {fetchByCustomer, fetchSlowByCustomer} from "../../api/by-customer";
import {RootState} from "../../app/configureStore";
import {selectSegmentsList} from "../segment-list";
import {customerKey} from "./utils";
import Decimal from "decimal.js";
import {selectFastPaceLoading, selectSlowPaceLoading} from "./selectors";

export const setSort = createAction<CustomerSort>('customers/sort');

export const loadCustomers = createAsyncThunk<CustomerPaceResponse, PaceArgs>(
    'customers/load',
    async (arg) => {
        const {pace} = await fetchByCustomer(arg.year, arg.month, arg.ARDivisionNo ?? '00');
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

export const slowLoadCustomers = createAsyncThunk<SlowPacePayload<SlowCustomerPaceRow>, PaceArgs>(
    'customers/slow-load',
    async (arg, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const segments = selectSegmentsList(state);
        const response: SlowPace<SlowCustomerPaceRow> = {}

        const {invoiced, currentInvoiced} = await fetchSlowByCustomer(arg.year, arg.month, arg.ARDivisionNo ?? '00');
        invoiced?.forEach(row => {
            response[customerKey(row)] = {...row, Segment: segments[row.Segment ?? '']?.ReportAsType ?? row.Segment}
        })
        currentInvoiced?.forEach(row => {
            const key = customerKey(row);
            if (!response[key]) {
                response[key] = {
                    ...row,
                    Segment: segments[row.Segment ?? '']?.ReportAsType ?? row.Segment,
                    InvoiceTotal: 0
                };
            }
            response[key].InvoiceTotal = new Decimal(response[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        })
        return {
            invoiced: response,
            timestamp: new Date().toISOString(),
        };
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSlowPaceLoading(state);
        }
    }
)
