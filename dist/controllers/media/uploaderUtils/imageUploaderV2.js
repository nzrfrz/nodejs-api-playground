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
exports.imageUploaderV2 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const _utils_1 = require("../../../_utils");
dotenv_1.default.config();
const imageUploaderV2 = (file, targetPath) => __awaiter(void 0, void 0, void 0, function* () {
    const newFileName = node_crypto_1.default.randomBytes(9).toString("hex");
    const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
    const { width, height } = metadata;
    const divisor = width / 256;
    const thumbMaxWidth = Math.floor(width / divisor);
    const thumbMaxHeight = Math.floor(height / divisor);
    const originalFileExtension = file.originalname.split('.').pop();
    const originalImageKey = `playground/${targetPath}/${newFileName}.${originalFileExtension}`;
    const thumbnailImageKey = `playground/${targetPath}/thumbnails/${newFileName}.webp`;
    const thumbnailImageBuffer = yield (0, sharp_1.default)(file.buffer).resize(thumbMaxWidth, thumbMaxHeight, { fit: "inside" }).webp().toBuffer();
    const imageObjects = [
        {
            key: originalImageKey,
            body: file.buffer,
            contentType: file.mimetype
        },
        {
            key: thumbnailImageKey,
            body: thumbnailImageBuffer,
            contentType: 'image/webp'
        }
    ];
    let uploadResult = {
        fileName: '',
        thumbnailFileName: '',
        originalFileURL: '',
        thumbnailURL: '',
    };
    for (let i = 0; i < imageObjects.length; i++) {
        const element = imageObjects[i];
        const s3Object = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: element.key,
            Body: element.body,
            ContentType: element.contentType,
        });
        yield _utils_1.s3.send(s3Object);
        uploadResult.fileName = originalImageKey.split('/').pop();
        uploadResult.thumbnailFileName = thumbnailImageKey.split('/').pop();
        uploadResult.originalFileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalImageKey}`;
        uploadResult.thumbnailURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailImageKey}`;
    }
    return uploadResult;
});
exports.imageUploaderV2 = imageUploaderV2;
//# sourceMappingURL=imageUploaderV2.js.map