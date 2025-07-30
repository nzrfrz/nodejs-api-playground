"use strict";
/**
 * Delete uploaded file based on file id and file types (alias).
 * This controller is using a request query to get the file id and file types (alias).
 * The Query = ?id=[FILE_ID]&type=[FILE_ALIAS + 's']
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
exports.serverDeleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const _utils_1 = require("../../../_utils");
const serverFileUploaderUtils_1 = require("../uploaderUtils/serverFileUploaderUtils");
const serverDeleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.query;
        const { fileUID, targetPath, originalFilePath, thumbnailPath } = (0, serverFileUploaderUtils_1.getDestPathByFilename)(fileName);
        yield fs_1.default.promises.unlink(originalFilePath + "/" + fileName);
        if (targetPath === 'images') {
            const thumbFiles = yield fs_1.default.promises.readdir(thumbnailPath, { withFileTypes: true });
            for (const thumbFile of thumbFiles) {
                if (thumbFile.name.includes(fileUID)) {
                    yield fs_1.default.promises.unlink(thumbnailPath + "/" + thumbFile.name);
                }
            }
        }
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, "File has been deleted", null);
    }
    catch (error) {
        // console.log('server delete file: ', error);
        if (error.toString().includes('ENOENT') === true) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: 'No such file or directory' });
            return;
        }
        if (error.code === 'EBUSY') {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, { message: 'File is busy or locked. Please try again later.' });
            return;
        }
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, { message: error.toString() });
    }
});
exports.serverDeleteFile = serverDeleteFile;
//# sourceMappingURL=serverDeleteFile.js.map