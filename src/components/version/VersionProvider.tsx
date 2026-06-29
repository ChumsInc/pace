import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useRef, useState} from "react";
import VersionContext, {type VersionContextState} from "@/components/version/VersionContext.tsx";
import {fetchJSON} from "@chumsinc/ui-utils";

export interface VersionProviderProps {
    children: ReactNode;
    defaultInterval?: number;
    onError?: (error: string) => void;
}

interface VersionResponse {
    version: string;
}

export default function VersionProvider({children, defaultInterval, onError}:VersionProviderProps) {
    const [version, setVersion] = useState<string|null>(null);
    const [status, setStatus] = useState<VersionContextState['status']>('idle');
    const [hasUpdate, setHasUpdate] = useState<boolean>(false);
    const intervalRef = useRef<number>(0);
    const abortController = useRef<AbortController|null>(null);

    const loadVersion = useCallback(async () => {
        try {
            if (!window.navigator.onLine) {
                return;
            }
            abortController.current = new AbortController();
            setStatus('loading');
            const res = await fetchJSON<VersionResponse>('./package.json', {
                cache: 'no-store',
                signal: abortController.current.signal
            });
            abortController.current = null;
            setStatus('idle');

            if (!version) {
                // handle initial load version
                setVersion(res?.version ?? null);
                setHasUpdate(false);
                return;
            }

            if (res?.version && res.version !== version) {
                setHasUpdate(true);
            }
        } catch(err:unknown) {
            if (onError) {
                onError(err instanceof Error ? err.message : 'Error in VersionProvider.loadVersion()');
            }
            setStatus('idle');
        }
    }, [version, onError]);

    useEffect(() => {
        startTransition(() => {
            loadVersion().catch(console.error);
            intervalRef.current = window.setInterval(loadVersion, defaultInterval ?? 60 * 60 * 1000);
        })
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
        // clear the interval and start a new timer
        window.clearInterval(intervalRef.current);
        loadVersion().catch(console.error);
        intervalRef.current = window.setInterval(loadVersion, defaultInterval ?? 60 * 60 * 1000);
    }, [loadVersion, defaultInterval]);

    const value:VersionContextState = useMemo(() => {
        return {
            version,
            status,
            hasUpdate,
            onClick: clickHandler
        }
    }, [clickHandler, version, status, hasUpdate])

    return  (
        <VersionContext value={value}>
            {children}
        </VersionContext>
    )
}
