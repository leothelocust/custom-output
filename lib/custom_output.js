"use strict";
var errorTypes = new Map()
    .set("MongoError", 7000)
    .set("ReferenceError", 7500) // Eg. When a function is incorrectly called internally (wrong spelling etc...)
    .set("ValidationError", 7422)
    .set("ClientNotFound", 6454)
    .set("Forbidden", 6455) // Authorized, but not allowed access
    .set("MissingRequestObject", 6456)
    .set("NotImplemented", 6557) // Eg. API endpoint isn't fully created (yet)
    .set("TokenExpired", 6458)
    .set("TokenNotFound", 6459)
    .set("Unauthorized", 6460)
    .set("UserNotFound", 6461);
var simpleError = function (errObj) {
    var devel = (process.env.ENV === "development");
    var error = [];
    if (errObj.errors) {
        var err = errObj.errors;
        for (var i in err) {
            if (!err.hasOwnProperty(i))
                continue;
            if ((typeof err[i]) == 'object') {
                var name_1 = err[i].name || "Error";
                var temp = {
                    name: name_1,
                    message: err[i].message || "No Message",
                    display_message: err[i].display_message || "",
                    stack: (devel ? err[i].stack || {} : undefined),
                    code: errorTypes.get(name_1) || 6500
                };
                error.push(temp);
            }
        }
    }
    else if (errObj.constructor === [].constructor) {
        for (var i = 0; i < errObj.length; i++) {
            var name_2 = errObj[i].name || "Error";
            var temp = {
                name: name_2 || "Error",
                message: errObj[i].message || "No Message",
                display_message: errObj[i].display_message || "",
                stack: (devel ? errObj[i].stack || {} : undefined),
                code: errorTypes.get(name_2) || 6500
            };
            error.push(temp);
        }
    }
    else {
        var name_3 = errObj.name;
        var temp = {
            name: name_3 || "Error",
            message: errObj.message || "No Message",
            display_message: errObj.display_message || "",
            stack: (devel ? errObj.stack || {} : undefined),
            code: errorTypes.get(name_3) || 6500
        };
        error.push(temp);
    }
    return error;
};
function FormatOutput(response, error, data, successStatusCode, errorStatusCode, optionalMeta) {
    var output = {};
    var status;
    if (!error) {
        output.data = data;
        if (data != null) {
            status = successStatusCode || 200;
            if (data.constructor === [].constructor) {
                output.meta = optionalMeta || {};
                output.meta.count = data.length;
            }
        }
        else {
            status = 204;
        }
    }
    else {
        output.errors = simpleError(error);
        status = errorStatusCode || error.status || 500;
    }
    return response.status(status).json(output);
}
exports.FormatOutput = FormatOutput;
