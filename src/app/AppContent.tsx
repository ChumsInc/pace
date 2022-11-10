import React from 'react';
import AppBar from "../ducks/app/AppBar";
import {Outlet} from "react-router-dom";
import LoadingBar from "../components/LoadingBar";
import PaceBreadcrumbs from "../ducks/app/PaceBreadcrumbs";
import ProfileStatus from "../ducks/profile/ProfileStatus";

const AppContent = () => {
    return (
        <div>
            <AppBar />
            <ProfileStatus />
            <PaceBreadcrumbs />
            <LoadingBar />
            <Outlet />
        </div>
    )
}

export default AppContent;
