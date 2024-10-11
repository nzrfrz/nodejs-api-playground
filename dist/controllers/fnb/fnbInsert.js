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
exports.fnbInsert = void 0;
const _utils_1 = require("../../_utils");
const models_1 = require("../../models");
const fnbInsert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.length !== undefined) {
            let resultsPool = [];
            for (let index = 0; index < req.body.length; index++) {
                const element = req.body[index];
                const category = yield (0, _utils_1.findOneDocument)(models_1.FNB_CATEGORIES, { _id: element.category.id });
                const payload = Object.assign(Object.assign({}, element), { editable: false, category: category.toJSON() });
                const bulkCreateResults = yield (0, _utils_1.bulkInsertDocument)(models_1.FNB, payload);
                resultsPool.push(bulkCreateResults);
            }
            (0, _utils_1.responseHelper)(res, _utils_1.status.successCreate, _utils_1.message.successInsert, { length: resultsPool.length, data: resultsPool });
            return;
        }
        else {
            const request = req.body;
            const category = yield (0, _utils_1.findOneDocument)(models_1.FNB_CATEGORIES, { _id: request.category.id });
            const payload = Object.assign(Object.assign({}, request), { editable: req.body.editable === undefined ? true : req.body.editable, category: category.toJSON() });
            const finalPayload = new models_1.FNB(payload);
            const results = yield (0, _utils_1.insertNewDocument)(finalPayload);
            (0, _utils_1.responseHelper)(res, _utils_1.status.successCreate, _utils_1.message.successInsert, results);
            return;
        }
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error);
    }
});
exports.fnbInsert = fnbInsert;
//# sourceMappingURL=fnbInsert.js.map