import {createAsyncThunk} from "@reduxjs/toolkit";
import type {CustomerPaceResponse, PaceArgs, SlowCustomerPaceRow, SlowPace, SlowPacePayload} from "../../types";
import {fetchByCustomer, fetchSlowByCustomer} from "../../api/by-customer";
import type {RootState} from "@/app/configureStore";
import {selectSegmentsList} from "../segment-list";
import {customerKey} from "./utils";
import Decimal from "decimal.js";
import {selectFastPaceStatus, selectSlowPaceStatus} from "./index";
import {selectProfileValid} from "@/ducks/profile";
import {idleStates} from "@/app/constants.ts";

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
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            const valid = selectProfileValid(state);
            const status = selectFastPaceStatus(state);
            return valid && idleStates.includes(status);
        }
    }
)

export const slowLoadCustomers = createAsyncThunk<SlowPacePayload<SlowCustomerPaceRow>, PaceArgs>(
    'customers/slow-load',
    async (arg, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const segments = selectSegmentsList(state);
        const invoiced: SlowPace<SlowCustomerPaceRow> = {}

        const response = await fetchSlowByCustomer(arg.year, arg.month, arg.ARDivisionNo ?? '00');
        response.invoiced?.forEach(row => {
            invoiced[customerKey(row)] = {...row, Segment: segments[row.Segment ?? '']?.ReportAsType ?? row.Segment}
        })
        response.currentInvoiced?.forEach(row => {
            const key = customerKey(row);
            if (!invoiced[key]) {
                invoiced[key] = {
                    ...row,
                    Segment: segments[row.Segment ?? '']?.ReportAsType ?? row.Segment,
                    InvoiceTotal: 0
                };
            }
            invoiced[key].InvoiceTotal = new Decimal(invoiced[key].InvoiceTotal).add(row.InvoiceTotal).toString();
        })
        return {
            invoiced: Object.values(invoiced),
            timestamp: new Date().toISOString(),
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
