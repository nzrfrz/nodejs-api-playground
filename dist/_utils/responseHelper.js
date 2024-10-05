"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHelper = exports.status = exports.message = void 0;
exports.message = {
    onlySuccess: "Success",
    successInsert: "New data addedd successfully",
    successEdit: "Data editted successfully",
    successDelete: "Data deleted successfully",
    onlyError: "Error",
    errorRequest: "Request Error",
    errorServer: "Internal server error!!",
    accessTokenNotFound: "Access token required !!!",
    accessTokenInvalid: "Access token invalid, please request again",
    refreshTokenNotFound: "Refresh token required !!!",
    refreshTokenExpired: "Refresh token expired, back to login",
    sessionExpired: "Session expired, please Login",
    expired: "Expired",
    tokenValid: "Token valid",
    accepted: "You are authorized, please continue...",
    forbidden: "Access prohibited",
    unauthorized: "Unauthorized user",
};
exports.status = {
    success: 200,
    successCreate: 201,
    accepted: 202,
    nothingToDo: 204,
    errorRequest: 400, // Bad Request
    unauthorized: 401, // Unauthorized
    forbidden: 403, // Forbidden
    notFound: 404,
    errorServer: 500, //data not saved in DB, or other server error,
    expired: 419, // expired
};
const responseHelper = (res, status, message, data) => {
    return res.status(status).send({ status, message, data });
};
exports.responseHelper = responseHelper;
//# sourceMappingURL=responseHelper.js.map