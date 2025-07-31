import type {UserProfile} from "chums-types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {UserValidationResponse} from "../../types";
import {fetchUserValidation} from "../../api/user";
import type {RootState} from "@/app/configureStore";

export interface ProfileState {
    valid: boolean;
    user: UserProfile | null;
    loading: boolean;
    loaded: string | null;
    error: string | null;
}

export const initialProfileState: ProfileState = {
    valid: false,
    user: null,
    loading: false,
    loaded: null,
    error: null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialProfileState,
    reducers: {
        dismissProfileError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserValidation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUserValidation.fulfilled, (state, action) => {
                state.loading = false;
                state.valid = action.payload.valid ?? false;
                state.user = action.payload.profile ?? null;
                state.loaded = action.payload.loaded;
                state.error = null;
            })
            .addCase(loadUserValidation.rejected, (state, action) => {
                state.loading = false;
                state.valid = false;
                state.user = null;
                state.error = action.error.message ?? null;
            })
    },
    selectors: {
        selectProfileValid: (state) => state.valid,
        selectProfileLoading: (state) => state.loading,
        selectProfileError: (state) => state.error,
    }
});

export default profileSlice;

export const {dismissProfileError} = profileSlice.actions;
export const {selectProfileValid, selectProfileLoading, selectProfileError} = profileSlice.selectors;


export const loadUserValidation = createAsyncThunk<UserValidationResponse, void, { state: RootState }>(
    'user/validate',
    async () => {
        const res = await fetchUserValidation();
        res.loaded = new Date().toISOString();
        return res;
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return !selectProfileLoading(state);
        }
    }
)

