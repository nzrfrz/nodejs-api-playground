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
exports.staticThumbnailViewer = void 0;
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const _utils_1 = require("../../../_utils");
const staticThumbnailViewer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parentPath = './uploads';
    const { id, type } = req.query;
    if (!id || !type) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: 'Missing file id or type query params' });
        return;
    }
    try {
        const fullPath = `${parentPath}/${type}/thumbnails`;
        const readDirectory = yield fs_1.default.promises.readdir(fullPath);
        const selectedFile = readDirectory.filter((data) => data.split(".")[0] === id)[0];
        if (!selectedFile) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.notFound, 'File not found', null);
            return;
        }
        const filePath = `${fullPath}/${selectedFile}`;
        const mimeType = mime_1.default.lookup(filePath) || "application/octet-stream";
        const fileBuffer = yield fs_1.default.promises.readFile(filePath);
        res.setHeader("Content-Type", mimeType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(fileBuffer);
    }
    catch (error) {
        console.error("Error in staticFileViewer:", error);
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, null);
    }
});
exports.staticThumbnailViewer = staticThumbnailViewer;
//# sourceMappingURL=staticThumbnailViewer.js.map