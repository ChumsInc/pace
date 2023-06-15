import {UserProfile} from "chums-types";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {UserValidationResponse} from "../../types";
import {fetchUserValidation} from "../../api/user";
import {RootState} from "../../app/configureStore";

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

export const selectProfileValid = (state:RootState) => state.profile.valid;
export const selectProfileLoading = (state:RootState) => state.profile.loading;
export const selectProfileError = (state:RootState) => state.profile.error;

export const loadUserValidation = createAsyncThunk<UserValidationResponse>(
    'user/validate',
    async () => {
        const res = await fetchUserValidation();
        res.loaded = new Date().toISOString();
        return res;
    }
)

const profileReducer = createReducer(initialProfileState, (builder) => {
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
});

export default profileReducer;
