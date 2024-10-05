"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaRouter_1 = __importDefault(require("./mediaRouter"));
const fnbRouter_1 = __importDefault(require("./fnbRouter"));
const router = express_1.default.Router();
exports.default = () => {
    (0, mediaRouter_1.default)(router);
    (0, fnbRouter_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map