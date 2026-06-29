import {createContext} from "react";

export interface VersionContextState {
    version: string|null;
    onClick: () => void;
    status: 'idle' | 'loading' | 'success' | 'has-update' | 'error';
    error?: string | null;
}

const VersionContext = createContext<VersionContextState | null>(null);
export default VersionContext;
