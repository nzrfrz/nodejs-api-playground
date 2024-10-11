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
exports.fnbDelete = void 0;
const _utils_1 = require("../../_utils");
const models_1 = require("../../models");
const fnbDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemID } = req.params;
        const prevFnB = yield (0, _utils_1.findOneDocument)(models_1.FNB, { _id: itemID });
        if (prevFnB.editable === false) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.forbidden, "You are not authorized to do this action!", null);
            return;
        }
        if (itemID === "all") {
            const results = yield (0, _utils_1.deleteAll)(models_1.FNB);
            (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successDelete, results);
            return;
        }
        else {
            const results = yield (0, _utils_1.deleteByID)(models_1.FNB, itemID);
            (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successDelete, results);
            return;
        }
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.fnbDelete = fnbDelete;
//# sourceMappingURL=fnbDelete.js.map