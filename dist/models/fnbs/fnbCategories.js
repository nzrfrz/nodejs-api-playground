"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FNB_CATEGORIES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
const FnbCategorySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    updatedAt: String,
    createdAt: String,
}, {
    timestamps: true,
});
FnbCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
FnbCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
exports.FNB_CATEGORIES = mongoose_1.default.model("fnbCategories", FnbCategorySchema);
//# sourceMappingURL=fnbCategories.js.map