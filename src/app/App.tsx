import React, {useEffect, useRef} from 'react';
import PaceByDivision from "../ducks/division/PaceByDivision";
import {Route, Routes} from "react-router-dom";
import {useAppDispatch} from "./configureStore";
import {loadSegments} from "../ducks/segment-list";
import PaceByCustomer from "../ducks/customer/PaceByCustomer";
import ErrorBoundary from "../components/ErrorBoundary";
import AppContent from "./AppContent";
import {useSelector} from "react-redux";
import {selectProfileValid} from "../ducks/profile";
import {Container} from "react-bootstrap";

const App = () => {
    const dispatch = useAppDispatch();
    const valid = useSelector(selectProfileValid);
    useEffect(() => {
        if (!valid) {
            return;
        }
        dispatch(loadSegments());
    }, [valid])

    return (
        <Container fluid="xl">
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<AppContent/>}>
                        <Route index element={<PaceByDivision/>}/>
                        <Route path="/:arDivisionNo" element={<PaceByCustomer/>}/>
                        <Route path="/:arDivisionNo/:segment" element={<PaceByCustomer/>}/>
                    </Route>

                </Routes>
            </ErrorBoundary>
        </Container>
    )
}

export default App;
