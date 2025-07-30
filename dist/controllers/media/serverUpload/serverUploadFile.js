"use strict";
/**
 * Server upload file API Controller using multer disk storage.
 * File size filter by request query, like maxFileSize.
 * Multer disk storage doesn't have a way to read the file metadata like file size on the go,
 * so the file needs to be store on the storage first then read its metadata,
 * and if the stored file exceeds the maxFileSize, then it will be deleted.
 * So, to lighten the server workload, file filter or file validation should be done on the front end first.
 * The Query = ?maxFileSize=
*/
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
exports.serverUploadFile = exports.serverUploadMulter = void 0;
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const async_lock_1 = __importDefault(require("async-lock"));
const _utils_1 = require("../../../_utils");
const fileTypeList_1 = require("../uploaderUtils/fileTypeList");
const imageThumbnailGenerator_1 = require("../uploaderUtils/imageThumbnailGenerator");
const serverFileUploaderUtils_1 = require("../uploaderUtils/serverFileUploaderUtils");
dotenv_1.default.config();
const lock = new async_lock_1.default();
const diskStorage = multer_1.default.diskStorage({
    destination: (_, file, cb) => {
        const destinationPath = (0, serverFileUploaderUtils_1.setDestinationPath)(file);
        fs_1.default.mkdirSync(destinationPath, { recursive: true });
        cb(null, destinationPath); // Specify the uploads folder
    },
    filename: (_, file, cb) => {
        var _a;
        const uniqueSuffix = node_crypto_1.default.randomBytes(9).toString("hex");
        const sourceExtension = mime_1.default.extension(file.mimetype);
        const getFileFormatManually = (_a = fileTypeList_1.fileTypeList.find((item) => item.mimeType === file.mimetype)) === null || _a === void 0 ? void 0 : _a.fileType;
        const finalFileExtension = sourceExtension === undefined ? getFileFormatManually : sourceExtension;
        // console.log(file, '\n', sourceExtension);
        cb(null, `${uniqueSuffix}.${finalFileExtension}`);
        // cb(null, uniqueSuffix + "." + finalFileExtension);
    }
});
exports.serverUploadMulter = (0, multer_1.default)({
    storage: diskStorage,
}).single('file');
const serverUploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: "No file uploaded" });
        return;
    }
    const fileLockKey = `file:${req.file.filename}`;
    try {
        yield lock.acquire(fileLockKey, () => __awaiter(void 0, void 0, void 0, function* () {
            const protocol = req.protocol;
            const headersHost = req.headers.host;
            const { maxFileSize } = req.query;
            const fileName = req.file.filename;
            const destinationPath = (0, serverFileUploaderUtils_1.setDestinationPath)(req.file);
            const uploadedFileSize = Number((req.file.size / (1024 * 1024)).toFixed(2));
            if (maxFileSize !== '' && uploadedFileSize > Number(maxFileSize)) {
                yield fs_1.default.promises.unlink(`${destinationPath}/${fileName}`);
                (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: `The file exceeds ${maxFileSize}MB` });
                return;
            }
            if ((0, serverFileUploaderUtils_1.isFileFormatAllowed)(req.file) === false) {
                yield fs_1.default.promises.unlink(`${destinationPath}/${fileName}`);
                (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: `Not supported file format` });
                return;
            }
            const fileAlias = fileTypeList_1.fileTypeList.find((item) => item.mimeType === req.file.mimetype).alias + 's';
            const fileId = req.file.filename.split(".")[0].toString();
            let originalFileURL;
            let thumbnailURL;
            if (fileAlias === 'images') {
                const thumbnailPath = yield (0, imageThumbnailGenerator_1.imageThumbnailGenerator)(req.file);
                req.file.thumbnailPath = thumbnailPath;
                originalFileURL = `${protocol}://${headersHost}/static-view/?id=${fileId}&type=${fileAlias}`;
                thumbnailURL = `${protocol}://${headersHost}/static-view-thumbnail/?id=${fileId}&type=${fileAlias}`;
            }
            else {
                originalFileURL = `${protocol}://${headersHost}/static-view/?id=${fileId}&type=${fileAlias}`;
            }
            const responseData = {
                id: fileId,
                fileName: req.file.filename,
                originalFileURL,
                thumbnailURL
            };
            // console.log(req.file);
            (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, responseData);
        }));
    }
    catch (error) {
        // console.log('server upload file: ', error);
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.serverUploadFile = serverUploadFile;
//# sourceMappingURL=serverUploadFile.js.map