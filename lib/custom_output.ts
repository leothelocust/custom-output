export interface Output {
    data?: any
    errors?: any
    meta?: any
}

export interface Error {
    name?: string
    message?: string
    display_message?: string
    stack?: any
    code?: number
    status?: any
}

let errorTypes: Map<string, number> = new Map<string, number>()
    // Not in my control Errors
    .set("MongoError", 7000)
    .set("ReferenceError", 7500) // Eg. When a function is incorrectly called internally (wrong spelling etc...)
    .set("ValidationError", 7422)
    // Custom Errors
    .set("ClientNotFound", 6454)
    .set("Forbidden", 6455) // Authorized, but not allowed access
    .set("MissingRequestObject", 6456)
    .set("NotImplemented", 6557) // Eg. API endpoint isn't fully created (yet)
    .set("TokenExpired", 6458)
    .set("TokenNotFound", 6459)
    .set("Unauthorized", 6460)
    .set("UserNotFound", 6461)

var simpleError = function(errObj: any) {
    let devel: boolean = (process.env.ENV === "development")
    let error: Error[] = [];
    
    if (errObj.errors) {
        let err = errObj.errors;
        for ( let i in err ) {
            if (!err.hasOwnProperty(i)) continue;

            if ((typeof err[i]) == 'object') {
                let name = err[i].name || "Error";
                let temp: Error = {
                    name : name,
                    message : err[i].message || "No Message",
                    display_message : err[i].display_message || "",
                    stack : (devel ? err[i].stack || {} : undefined),
                    code : errorTypes.get(name) || 6500
                };
                error.push(temp);
            }

        }
    } else if (errObj.constructor === [].constructor) {
        for ( let i = 0; i < errObj.length; i++ ) {
            let name = errObj[i].name || "Error";
            let temp: Error = {
                name : name || "Error",
                message : errObj[i].message || "No Message",
                display_message : errObj[i].display_message || "",
                stack : (devel ? errObj[i].stack || {} : undefined),
                code : errorTypes.get(name) || 6500
            };
            error.push(temp);
        }
    } else {
        let name = errObj.name;
        let temp: Error = {
            name : name || "Error",
            message : errObj.message || "No Message",
            display_message : errObj.display_message || "",
            stack : (devel ? errObj.stack || {} : undefined),
            code : errorTypes.get(name) || 6500
        };
        error.push(temp);
    }
    return error;
};

export function FormatOutput(response: any, error?: Error, data?: any, successStatusCode?: number, errorStatusCode?: number, optionalMeta?: any): any {
    let output: Output = {};
    let status: number;
    if (!error) {
        output.data = data;
        if (data != null) {
            status = successStatusCode || 200;
            if (data.constructor === [].constructor) {
                output.meta = optionalMeta || {};
                output.meta.count = data.length;
            }
        }  else {
            status = 204;
        }
    } else {
        output.errors = simpleError(error);
        status = errorStatusCode || error.status || 500;
    }
    return response.status(status).json(output);
}
