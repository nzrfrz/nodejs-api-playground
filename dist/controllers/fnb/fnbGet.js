"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnbGet = void 0;
const _utils_1 = require("../../_utils");
const _fnbPaginatedQuery_1 = require("./_fnbPaginatedQuery");
const fnbGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit);
        const page = Number(req.query.page) - 1;
        const availability = req.query.status;
        const searchValue = req.query.q;
        if (Number.isNaN(limit) === true || Number.isNaN(page) === true || searchValue === undefined || availability === undefined) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: "Query string cannot be empty" });
            return;
        }
        else {
            const results = yield (0, _fnbPaginatedQuery_1.fnbPaginatedQuery)(page, limit, availability, searchValue);
            (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, results);
            return;
        }
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.fnbGet = fnbGet;
//# sourceMappingURL=fnbGet.js.map