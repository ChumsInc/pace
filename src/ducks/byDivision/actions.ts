import {createAsyncThunk} from "@reduxjs/toolkit";
import {DivisionPaceRow, PaceArgs, SlowPaceResponse} from "../../types";
import {fetchByDivision, fetchSlowByDivision} from "../../api/pace";


export const loadDivisionPace = createAsyncThunk<void, PaceArgs>(
    'byDivision/loadPace',
    async (arg, thunkApi) => {
        await loadByDivision(arg);
        await slowLoadByDivision(arg);
    }
)

export const loadByDivision = createAsyncThunk<DivisionPaceRow[], PaceArgs>(
    'byDivision/load',
    async (arg, thunkApi) => {
        return await fetchByDivision(arg.year, arg.month);
    }
)

export const slowLoadByDivision = createAsyncThunk<SlowPaceResponse, PaceArgs>(
    'byDivision/slow-load',
    async (arg, thunkApi) => {
        return fetchSlowByDivision(arg.year, arg.month);
    }
)
