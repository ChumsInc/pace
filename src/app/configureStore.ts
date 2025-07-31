import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import divisionSlice from "../ducks/division";
import appSlice from "../ducks/app";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import segmentSlice from "../ducks/segment";
import segmentListSlice from "../ducks/segment-list";
import customerSlice from "../ducks/customer";
import profileSlice from "../ducks/profile";

const rootReducer = combineReducers({
    [appSlice.reducerPath]: appSlice.reducer,
    [divisionSlice.reducerPath]: divisionSlice.reducer,
    [segmentSlice.reducerPath]: segmentSlice.reducer,
    [customerSlice.reducerPath]: customerSlice.reducer,
    [segmentListSlice.reducerPath]: segmentListSlice.reducer,
    [profileSlice.reducerPath]: profileSlice.reducer,
})

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
