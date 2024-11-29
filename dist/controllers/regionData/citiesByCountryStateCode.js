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
exports.citiesByCountryStateCode = void 0;
const _utils_1 = require("../../_utils");
const axios_1 = __importDefault(require("axios"));
const citiesByCountryStateCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { iso2CountryCode, stateCode } = req.params;
        const basePath = process.env.REGION_DATA_BASE_PATH;
        const getStates = yield axios_1.default.get(`${basePath}/api/region-data/cities-by-country-state-code/iso2CountryCode=${iso2CountryCode}/stateCode=${stateCode}`);
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, getStates.data.data);
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.citiesByCountryStateCode = citiesByCountryStateCode;
//# sourceMappingURL=citiesByCountryStateCode.js.map