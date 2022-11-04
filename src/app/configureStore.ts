import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import byDivisionReducer from "../ducks/byDivision";
import appReducer from "../ducks/app";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    app: appReducer,
    byDivision: byDivisionReducer,
})

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
