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
exports.imageUploader = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const _utils_1 = require("../../../_utils");
dotenv_1.default.config();
const imageUploader = (file, targetPath) => __awaiter(void 0, void 0, void 0, function* () {
    const maxWidth = 1920;
    const maxHeight = 1080;
    const newFileName = node_crypto_1.default.randomBytes(9).toString("hex");
    const isGIF = file.mimetype === 'image/gif';
    const isSVG = file.mimetype === 'image/svg+xml';
    const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
    const { width, height } = metadata;
    const divisor = width / 256;
    const thumbMaxWidth = Math.floor(width / divisor);
    const thumbMaxHeight = Math.floor(height / divisor);
    const originalFileExtension = file.originalname.split('.').pop();
    let imageBuffer;
    let originalImageFileBuffer;
    if (isGIF === true)
        originalImageFileBuffer = yield (0, sharp_1.default)(file.buffer, { animated: true }).gif().toBuffer();
    else if (isSVG === true)
        originalImageFileBuffer = file.buffer;
    else
        originalImageFileBuffer = yield (0, sharp_1.default)(file.buffer).webp().toBuffer();
    const bufferForGIF = yield (0, sharp_1.default)(file.buffer, { animated: true }).resize(maxWidth, maxHeight, { fit: "inside" }).gif().toBuffer();
    const bufferForOther = yield (0, sharp_1.default)(file.buffer).resize(maxWidth, maxHeight, { fit: "inside" }).webp().toBuffer();
    const finalImageBuffer = isGIF === false ? bufferForOther : bufferForGIF;
    if (width > maxWidth || height > maxHeight)
        imageBuffer = finalImageBuffer;
    else
        imageBuffer = originalImageFileBuffer;
    let originalImageKey = '';
    if (isGIF === true || isSVG === true)
        originalImageKey = `playground/${targetPath}/${newFileName}.${originalFileExtension}`;
    else
        originalImageKey = `playground/${targetPath}/${newFileName}.webp`;
    const thumbnailImageKey = `playground/${targetPath}/thumbnails/${newFileName}.webp`;
    const thumbnailImageBuffer = yield (0, sharp_1.default)(file.buffer).resize(thumbMaxWidth, thumbMaxHeight, { fit: "inside" }).webp().toBuffer();
    let originalContentType = '';
    if (isGIF === true)
        originalContentType = 'image/gif';
    else if (isSVG === true)
        originalContentType = 'image/svg+xml';
    else
        originalContentType = `image/webp`;
    const imageObjects = [
        {
            key: originalImageKey,
            body: imageBuffer,
            contentType: originalContentType
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
exports.imageUploader = imageUploader;
//# sourceMappingURL=imageUploader.js.map