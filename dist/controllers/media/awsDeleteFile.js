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
exports.awsDeleteFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const _utils_1 = require("../../_utils");
const client_s3_1 = require("@aws-sdk/client-s3");
dotenv_1.default.config();
const awsDeleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { targetPath, thumbPath, fileName } = req.query;
        const deleteTargetFile = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${targetPath}/${fileName}`,
        });
        yield _utils_1.s3.send(deleteTargetFile);
        if (thumbPath !== "") {
            const deleteThumbFile = new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${targetPath}/${thumbPath}/${fileName}`,
            });
            yield _utils_1.s3.send(deleteThumbFile);
        }
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.successDelete, null);
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error);
    }
});
exports.awsDeleteFile = awsDeleteFile;
//# sourceMappingURL=awsDeleteFile.js.map