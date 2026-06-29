import type {ReactNode} from "react";
import VersionProvider from "@/components/version/VersionProvider.tsx";
import CurrentVersion from "@/components/version/CurrentVersion.tsx";
import Stack from "react-bootstrap/Stack";
import VersionUpdateToast from "@/components/version/VersionUpdateToast.tsx";

export interface AppVersionProps {
    versionComponent?: ReactNode;
    toastComponent?: ReactNode;
    defaultInterval?: number;
}
export default function AppVersion({versionComponent, toastComponent, defaultInterval}:AppVersionProps) {
    return (
        <VersionProvider defaultInterval={defaultInterval}>
            <Stack direction="horizontal" gap={2}>
                {versionComponent || <CurrentVersion/>}
                {toastComponent || <VersionUpdateToast/>}
            </Stack>
        </VersionProvider>
    )
}
