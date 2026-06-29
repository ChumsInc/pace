import {createContext} from "react";

export interface VersionContextState {
    version: string|null;
    hasUpdate: boolean;
    status: 'idle' | 'loading' | 'success' | 'has-update' | 'error';
    onClick: () => void;
}

const VersionContext = createContext<VersionContextState | null>(null);
export default VersionContext;
