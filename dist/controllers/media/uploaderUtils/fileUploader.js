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
exports.fileUploader = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const _utils_1 = require("../../../_utils");
dotenv_1.default.config();
const fileUploader = (file, targetPath) => __awaiter(void 0, void 0, void 0, function* () {
    const newFileName = node_crypto_1.default.randomBytes(9).toString("hex");
    const fileBuffer = file.buffer;
    const originalFileExtension = file.originalname.split('.').pop();
    const completeFileName = `${newFileName}.${originalFileExtension}`;
    const s3FileKey = `playground/${targetPath}/${completeFileName}`;
    let uploadResult = {
        fileName: '',
        originalFileURL: '',
    };
    const s3Object = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3FileKey,
        Body: fileBuffer,
        ContentType: file.mimetype,
    });
    yield _utils_1.s3.send(s3Object);
    uploadResult.fileName = completeFileName;
    uploadResult.originalFileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`;
    // console.log(s3Object);
    return uploadResult;
});
exports.fileUploader = fileUploader;
//# sourceMappingURL=fileUploader.js.map