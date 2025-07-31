import {useEffect} from 'react';
import PaceByDivision from "../ducks/division/PaceByDivision";
import {Route, Routes} from "react-router";
import {useAppDispatch, useAppSelector} from "./configureStore";
import {loadSegments} from "@/ducks/segment-list";
import PaceByCustomer from "../ducks/customer/PaceByCustomer";
import {ErrorBoundary} from "react-error-boundary";
import AppContent from "./AppContent";
import {selectProfileValid} from "@/ducks/profile";
import {Container} from "react-bootstrap";
import ErrorBoundaryFallbackAlert from "./ErrorBoundaryFallbackAlert";

const App = () => {
    const dispatch = useAppDispatch();
    const valid = useAppSelector(selectProfileValid);
    useEffect(() => {
        if (!valid) {
            return;
        }
        dispatch(loadSegments());
    }, [valid, dispatch])

    return (
        <Container fluid="xl">
            <ErrorBoundary fallback={undefined} FallbackComponent={ErrorBoundaryFallbackAlert}>
                <Routes>
                    <Route path="/" element={<AppContent/>}>
                        <Route index element={<PaceByDivision/>}/>
                        <Route path="/:arDivisionNo/:segment?" element={<PaceByCustomer/>}/>
                    </Route>
                </Routes>
            </ErrorBoundary>
        </Container>
    )
}

export default App;
