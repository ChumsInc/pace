import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import divisionReducer from "../ducks/division";
import appReducer from "../ducks/app";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import segmentReducer from "../ducks/segment";
import segmentsReducer from "../ducks/segment-list";
import customerReducer from "../ducks/customer";
import profileReducer from "../ducks/profile";

const rootReducer = combineReducers({
    app: appReducer,
    division: divisionReducer,
    segment: segmentReducer,
    customer: customerReducer,
    segments: segmentsReducer,
    profile: profileReducer,
})

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
