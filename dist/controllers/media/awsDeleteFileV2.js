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
exports.awsDeleteFileV2 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const _utils_1 = require("../../_utils");
const client_s3_1 = require("@aws-sdk/client-s3");
const fileTypeList_1 = require("./uploaderUtils/fileTypeList");
dotenv_1.default.config();
const awsDeleteFileV2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.query;
        if (!fileName || typeof fileName !== 'string') {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { message: 'File Name (fileName) in url query required' });
            return;
        }
        const splitFileName = fileName.split('.');
        const fileExtension = `.${splitFileName[splitFileName.length - 1]}`;
        const awsTargetPath = fileTypeList_1.fileTypeList.find((item) => item.fileType === fileExtension).alias + 's';
        const awsCompleteTargetPath = `playground/${awsTargetPath}/${fileName}`;
        const deleteTargetFile = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: awsCompleteTargetPath,
        });
        yield _utils_1.s3.send(deleteTargetFile);
        if (awsTargetPath === 'images') {
            const deleteThumbnailImage = new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `playground/${awsTargetPath}/thumbnails/${splitFileName[0]}.webp`,
            });
            yield _utils_1.s3.send(deleteThumbnailImage);
        }
        // console.log(awsTargetPath);
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successDelete, null);
    }
    catch (error) {
        // console.log('aws delete file v2: ', error);    
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.awsDeleteFileV2 = awsDeleteFileV2;
//# sourceMappingURL=awsDeleteFileV2.js.map