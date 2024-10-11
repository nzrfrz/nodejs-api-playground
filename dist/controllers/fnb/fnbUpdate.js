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
exports.fnbUpdate = void 0;
const _utils_1 = require("../../_utils");
const models_1 = require("../../models");
const fnbUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemID } = req.params;
        const prevFnB = yield (0, _utils_1.findOneDocument)(models_1.FNB, { _id: itemID });
        if (prevFnB.editable === false) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.forbidden, "You are not authorized to do this action!", null);
            return;
        }
        const category = yield (0, _utils_1.findOneDocument)(models_1.FNB_CATEGORIES, { _id: req.body.category.id });
        const payload = Object.assign(Object.assign({}, req.body), { category: category.toJSON() });
        const updateResult = yield (0, _utils_1.updateByID)(models_1.FNB, itemID, payload);
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successEdit, updateResult);
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.fnbUpdate = fnbUpdate;
//# sourceMappingURL=fnbUpdate.js.map