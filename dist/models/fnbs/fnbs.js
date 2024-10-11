"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FNB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
const FnbSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        url: String,
        thumbnailUrl: String,
        fileName: String
    },
    price: Number,
    status: String,
    category: {
        id: String,
        title: String,
        slug: String,
    },
    editable: Boolean,
    updatedAt: String,
    createdAt: String,
}, {
    timestamps: true,
});
FnbSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
FnbSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
exports.FNB = mongoose_1.default.model("fnbs", FnbSchema);
//# sourceMappingURL=fnbs.js.map