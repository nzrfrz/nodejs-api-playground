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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUrlFileValidity = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const _utils_1 = require("../../_utils");
dotenv_1.default.config();
const checkUrlFileValidity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield axios_1.default.get(req.body.url);
        const fetchResults = {
            fetchStatus: results.status,
            message: results.statusText,
        };
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, fetchResults);
    }
    catch (error) {
        if (error.status === 404) {
            const errorResults = {
                fetchStatus: error.status,
                message: "File not found",
            };
            (0, _utils_1.responseHelper)(res, _utils_1.status.notFound, _utils_1.message.errorRequest, errorResults);
            return;
        }
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.checkUrlFileValidity = checkUrlFileValidity;
//# sourceMappingURL=checkUrlFileValidity.js.map