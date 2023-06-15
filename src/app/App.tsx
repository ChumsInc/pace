import React, {useEffect} from 'react';
import PaceByDivision from "../ducks/division/PaceByDivision";
import {Route, Routes} from "react-router-dom";
import {useAppDispatch} from "./configureStore";
import {loadSegments} from "../ducks/segment-list";
import PaceByCustomer from "../ducks/customer/PaceByCustomer";
import ErrorBoundary from "../components/ErrorBoundary";
import AppContent from "./AppContent";
import {useSelector} from "react-redux";
import {selectProfileValid} from "../ducks/profile";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
    const dispatch = useAppDispatch();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const valid = useSelector(selectProfileValid);

    useEffect(() => {
        if (!valid) {
            return;
        }
        dispatch(loadSegments());
    }, [valid])

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="container-xl">
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<AppContent/>}>
                            <Route index element={<PaceByDivision/>}/>
                            <Route path="/:arDivisionNo" element={<PaceByCustomer/>}/>
                            <Route path="/:arDivisionNo/:segment" element={<PaceByCustomer/>}/>
                        </Route>

                    </Routes>
                </ErrorBoundary>
            </div>
        </ThemeProvider>
    )
}

export default App;
