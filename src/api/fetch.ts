async function handleJSONResponse<T = unknown>(res:Response):Promise<T|null> {
    if (!res.ok) {
        const text = await res.text();
        return Promise.reject(new Error(text));
    }
    const json = await res.json() ;
    if (json.error) {
        console.warn(json.error);
        return Promise.reject(new Error(json.error));
    }
    return json as T ?? null;
}

export async function fetchJSON<T = unknown>(url:string, options:RequestInit = {}):Promise<T|null> {
    try {
        if (!!options?.method && ['POST', 'PUT'].includes(options.method.toUpperCase())) {
            const headers = options?.headers || {};
            if (options?.headers) {
                delete options.headers;
            }
            options.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            }
        }
        const res = await fetch(url, {credentials: 'same-origin', ...options});
        return await handleJSONResponse<T>(res);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("fetchJSON()", err.message);
            return Promise.reject(err);
        }
        console.error("fetchJSON()", err);
        if (typeof err === 'string') {
            return Promise.reject(new Error(err));
        }
        return Promise.reject(err);
    }
}

export async function fetchHTML(url:string, options: RequestInit = {}):Promise<string|undefined> {
    try {
        const res = await fetch(url, {credentials: 'same-origin', ...options});
        if (!res.ok) {
            const text = await res.text();
            return Promise.reject(new Error(text));
        }
        return await res.text();
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("fetchHTML()", err.message);
            return Promise.reject(err);
        }
        console.error("fetchHTML()", err)
        if (typeof err === 'string') {
            return Promise.reject(new Error(err));
        }
        return Promise.reject(err);
    }
}
