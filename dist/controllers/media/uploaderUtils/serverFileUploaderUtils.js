"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFileFormatAllowed = exports.getDestPathByFilename = exports.setDestinationPath = void 0;
const fileTypeList_1 = require("./fileTypeList");
const setDestinationPath = (file) => {
    var _a;
    const fileTargetPath = ((_a = fileTypeList_1.fileTypeList.find((item) => item.mimeType === file.mimetype)) === null || _a === void 0 ? void 0 : _a.alias) + 's';
    const destinationPath = `./uploads/${fileTargetPath}/`;
    return destinationPath;
};
exports.setDestinationPath = setDestinationPath;
const getDestPathByFilename = (fileName) => {
    const splitFilename = fileName.split('.');
    const fileUID = splitFilename[0];
    const fileFormat = splitFilename[1];
    // console.log(splitFilename, fileUID, fileFormat);
    const getTargetPath = fileTypeList_1.fileTypeList.find((item) => item.fileType === fileFormat).alias + 's';
    const completeFilePath = {
        fileUID,
        targetPath: getTargetPath,
        originalFilePath: '',
        thumbnailPath: '',
    };
    if (getTargetPath === 'images') {
        completeFilePath.originalFilePath = `./uploads/${getTargetPath}`;
        completeFilePath.thumbnailPath = `./uploads/${getTargetPath}/thumbnails`;
    }
    else
        completeFilePath.originalFilePath = `./uploads/${getTargetPath}`;
    return completeFilePath;
};
exports.getDestPathByFilename = getDestPathByFilename;
const isFileFormatAllowed = (file) => {
    const fileTargetPath = fileTypeList_1.fileTypeList.find((item) => item.mimeType === file.mimetype).isAllowed;
    return fileTargetPath;
};
exports.isFileFormatAllowed = isFileFormatAllowed;
//# sourceMappingURL=serverFileUploaderUtils.js.map