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
exports.awsUploadFileV2 = exports.awsUploadMulterV2 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const _utils_1 = require("../../_utils");
const fileTypeList_1 = require("./uploaderUtils/fileTypeList");
const imageUploader_1 = require("./uploaderUtils/imageUploader");
const videoUploader_1 = require("./uploaderUtils/videoUploader");
const fileUploader_1 = require("./uploaderUtils/fileUploader");
dotenv_1.default.config();
const storage = multer_1.default.memoryStorage();
exports.awsUploadMulterV2 = (0, multer_1.default)({ storage: storage });
const awsUploadFileV2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { maxFileSize } = req.query;
        const file = req.file;
        if (!file) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, null);
            return;
        }
        const DEFAULT_MAX_FILE_SIZE = 5; // remove this if not using vercel hobby plan
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        let finalMaxFileSize;
        if (maxFileSize === '' || maxFileSize === 'undefined')
            finalMaxFileSize = DEFAULT_MAX_FILE_SIZE;
        else
            finalMaxFileSize = maxFileSize;
        if (sizeInMB > finalMaxFileSize) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: `File size is more than ${finalMaxFileSize}MB` });
            return;
        }
        const targetPath = ((_a = fileTypeList_1.fileTypeList.find((item) => item.mimeType === file.mimetype)) === null || _a === void 0 ? void 0 : _a.alias) + 's';
        if (targetPath === undefined) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, 'File type not allowed', null);
            return;
        }
        let uploadResponse;
        switch (targetPath) {
            case 'images':
                uploadResponse = yield (0, imageUploader_1.imageUploader)(file, targetPath);
                break;
            case 'videos':
                uploadResponse = yield (0, videoUploader_1.videoUploader)(file, targetPath);
                break;
            default:
                uploadResponse = yield (0, fileUploader_1.fileUploader)(file, targetPath);
                break;
        }
        // console.log('target path: ', file);
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, uploadResponse);
    }
    catch (error) {
        console.log(error);
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error);
    }
});
exports.awsUploadFileV2 = awsUploadFileV2;
//# sourceMappingURL=awsUploadFileV2.js.map