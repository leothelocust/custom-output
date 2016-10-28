export interface Output {
    data?: any;
    errors?: any;
    meta?: any;
}
export interface Error {
    name?: string;
    message?: string;
    display_message?: string;
    stack?: any;
    code?: number;
    status?: any;
}
export declare function FormatOutput(response: any, error?: Error, data?: any, successStatusCode?: number, errorStatusCode?: number, optionalMeta?: any): any;
