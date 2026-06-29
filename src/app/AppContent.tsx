import AppBar from "../ducks/app/AppBar";
import {Outlet} from "react-router";
import LoadingBar from "../components/LoadingBar";
import PaceBreadcrumbs from "../ducks/app/PaceBreadcrumbs";
import ProfileStatus from "../ducks/profile/ProfileStatus";
import AppVersion from "@/components/version/AppVersion.tsx";

const AppContent = () => {
    return (
        <div>
            <AppBar/>
            <ProfileStatus/>
            <PaceBreadcrumbs/>
            <LoadingBar/>
            <Outlet/>
            <AppVersion/>
        </div>
    )
}

export default AppContent;
