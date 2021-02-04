export type FetchSignature = (input: Request | string, init?: RequestInit) => Promise<Response>;

export const TypeRestDefaults: {
    fetchImplementation: FetchSignature | null
} = {
    fetchImplementation: null
};