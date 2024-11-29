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
exports.deleteAll = exports.deleteByID = exports.updateByID = exports.findOneDocument = exports.readDocumentByModel = exports.readDocument = exports.bulkInsertDocument = exports.insertNewDocument = void 0;
;
;
const insertNewDocument = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data.save();
});
exports.insertNewDocument = insertNewDocument;
const bulkInsertDocument = (collection, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield collection.create(data);
});
exports.bulkInsertDocument = bulkInsertDocument;
const readDocument = (collection, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield collection.find(args);
});
exports.readDocument = readDocument;
const readDocumentByModel = (model, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.find(args).toArray();
});
exports.readDocumentByModel = readDocumentByModel;
const findOneDocument = (collection, args) => __awaiter(void 0, void 0, void 0, function* () {
    const query = collection.where(args);
    return yield query.findOne();
});
exports.findOneDocument = findOneDocument;
const updateByID = (collection, id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield collection.findByIdAndUpdate(id, data, { new: true });
});
exports.updateByID = updateByID;
const deleteByID = (collection, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield collection.findByIdAndDelete(id);
});
exports.deleteByID = deleteByID;
const deleteAll = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    return yield collection.deleteMany();
});
exports.deleteAll = deleteAll;
//# sourceMappingURL=queryManager.js.map