import React from 'react';
import AppBar from "../ducks/app/AppBar";
import PaceByDivision from "../ducks/byDivision/PaceByDivision";

const App = () => {
    return (
        <div className="container">
            <AppBar />
            <PaceByDivision />
        </div>
    )
}

export default App;
