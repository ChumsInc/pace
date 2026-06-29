import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import VersionContext, {type VersionContextState} from "@/components/version/VersionContext.tsx";
import {fetchJSON} from "@chumsinc/ui-utils";

export interface VersionProviderProps {
    children: ReactNode;
    defaultInterval?: number;
}

interface VersionResponse {
    version: string;
}

export default function VersionProvider({children, defaultInterval}:VersionProviderProps) {
    const [version, setVersion] = useState<string|null>(null);
    const [status, setStatus] = useState<VersionContextState['status']>('idle');
    const [error, setError] = useState<string|null>(null);
    const intervalRef = useRef<number>(0);
    const abortController = useRef<AbortController|null>(null);

    const loadVersion = useCallback(async () => {
        try {
            abortController.current = new AbortController();
            setStatus('loading');
            const res = await fetchJSON<VersionResponse>('./package.json', {
                cache: 'no-store',
                signal: abortController.current.signal
            });
            setStatus('idle');
            if (!version) {
                setVersion(res?.version ?? null);
            } else if (res?.version !== version) {
                setStatus('has-update');
            }
            abortController.current = null;
        } catch(err:unknown) {
            setStatus('error');
            if (err instanceof Error) {
                setError(err.message);
                return;
            }
            setError('Error in loadVersion');
        }
    }, []);

    useEffect(() => {
        loadVersion().catch(console.error);
        intervalRef.current = window.setInterval(loadVersion, defaultInterval ?? 60 * 60 * 1000);
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        }
    }, [defaultInterval, loadVersion])

    const clickHandler = useCallback(() => {
        if (abortController.current) {
            abortController.current.abort('User clicked reload button');
        }
        if (status === 'has-update') {
            window.location.reload();
            return;
        }
        loadVersion().catch(console.error);
    }, [status]);

    const value:VersionContextState = useMemo(() => {
        return {
            version,
            status,
            error,
            onClick: clickHandler
        }
    }, [clickHandler, version, status, error])

    return  (
        <VersionContext value={value}>
            {children}
        </VersionContext>
    )
}
