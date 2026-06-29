import type {ReactNode} from "react";
import VersionProvider from "@/components/version/VersionProvider.tsx";
import CurrentVersion from "@/components/version/CurrentVersion.tsx";
import Stack from "react-bootstrap/Stack";
import VersionUpdateToast from "@/components/version/VersionUpdateToast.tsx";

export interface AppVersionProps {
    children?: ReactNode;
    defaultInterval?: number;
}
export default function AppVersion({children, defaultInterval}:AppVersionProps) {
    return (
        <VersionProvider defaultInterval={defaultInterval}>
            <Stack direction="horizontal" gap={2}>
                {children || <CurrentVersion/>}
                <VersionUpdateToast />
            </Stack>
        </VersionProvider>
    )
}
