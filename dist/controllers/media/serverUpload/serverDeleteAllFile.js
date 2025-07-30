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
exports.serverDeleteAllFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _utils_1 = require("../../../_utils");
const serverDeleteAllFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parentPath = './uploads';
        const readParentDir = yield fs_1.default.promises.readdir(parentPath, { withFileTypes: true });
        let deletedFiles = [];
        for (const dirEntry of readParentDir) {
            /** Skip if it's not a directory or if it's the thumbnails directory */
            if (!dirEntry.isDirectory() || dirEntry.name === 'thumbnails')
                continue;
            const dirPath = path_1.default.join(parentPath, dirEntry.name);
            const files = yield fs_1.default.promises.readdir(dirPath, { withFileTypes: true });
            for (const file of files) {
                /** Skip .txt files and thumbnails directory */
                if (file.name.endsWith('.txt'))
                    continue;
                if (dirEntry.name === 'images' && file.name === 'thumbnails') {
                    const thumbnailPath = path_1.default.join(dirPath, 'thumbnails');
                    const thumbnailFiles = yield fs_1.default.promises.readdir(thumbnailPath, { withFileTypes: true });
                    for (const thumbFile of thumbnailFiles) {
                        if (thumbFile.name.endsWith('.txt'))
                            continue;
                        const thumbFilePath = path_1.default.join(thumbnailPath, thumbFile.name);
                        yield fs_1.default.promises.unlink(thumbFilePath);
                        deletedFiles.push(thumbFile.name);
                    }
                    continue;
                }
                const filePath = path_1.default.join(dirPath, file.name);
                yield fs_1.default.promises.unlink(filePath);
                deletedFiles.push(file.name);
                // console.log('original files: ', file.name);
            }
        }
        // console.log('server delete all file: ', deletedFiles.length);
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successDelete, { message: `${deletedFiles.length} file(s) has been deleted.` });
    }
    catch (error) {
        // console.log('server delete file: ', error);
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, null);
    }
});
exports.serverDeleteAllFile = serverDeleteAllFile;
//# sourceMappingURL=serverDeleteAllFile.js.map