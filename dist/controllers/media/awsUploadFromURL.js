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
exports.awsUploadFromURL = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const _utils_1 = require("../../_utils");
const client_s3_1 = require("@aws-sdk/client-s3");
dotenv_1.default.config();
const HD_WIDTH = 1280;
const HD_HEIGHT = 720;
const THUMBNAIL_WIDTH = HD_WIDTH / 10;
const THUMBNAIL_HEIGHT = HD_HEIGHT / 10;
const awsUploadFromURL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageURL, targetPath, thumbPath } = req.body;
        if (imageURL === "" || !imageURL) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, null);
            return;
        }
        const imageResults = yield axios_1.default.get(imageURL, { responseType: "arraybuffer" });
        const contentType = imageResults.headers["content-type"];
        const newFileName = node_crypto_1.default.randomBytes(9).toString("hex");
        const fileType = contentType.split("/")[1];
        let targetFileBuffer;
        let uploadTargetFile;
        if (contentType.startsWith('image/') && targetPath === "images") {
            const metadata = yield (0, sharp_1.default)(imageResults.data).metadata();
            const { width, height } = metadata;
            if (width > HD_WIDTH || height > HD_HEIGHT) {
                targetFileBuffer = yield (0, sharp_1.default)(imageResults.data).resize(HD_WIDTH, HD_HEIGHT, { fit: "inside" }).toBuffer();
            }
            else
                targetFileBuffer = imageResults.data;
            const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
            uploadTargetFile = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: targetImageKey,
                Body: targetFileBuffer,
                ContentType: contentType,
            });
        }
        else if (!contentType.startsWith('image/') && targetPath === "files") {
            targetFileBuffer = imageResults.data;
            const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
            uploadTargetFile = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: targetImageKey,
                Body: targetFileBuffer,
                ContentType: contentType,
            });
        }
        else {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { status: 400, message: "You need to check the file type and the targetPath param" });
            return;
        }
        yield _utils_1.s3.send(uploadTargetFile);
        if (thumbPath !== "") {
            const thumbnailBuffer = yield (0, sharp_1.default)(imageResults.data).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "inside" }).toBuffer();
            const thumbnailImageKey = `${targetPath}/${thumbPath}/${newFileName}.${fileType}`;
            const uploadThumbnailImage = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: thumbnailImageKey,
                Body: thumbnailBuffer,
                ContentType: contentType,
            });
            yield _utils_1.s3.send(uploadThumbnailImage);
        }
        const s3imageResults = {
            image: {
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${newFileName}.${fileType}`,
                thumbnailUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${thumbPath}/${newFileName}.${fileType}`,
                fileName: `${newFileName}.${fileType}`,
            }
        };
        const fileResults = {
            file: {
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${newFileName}.${fileType}`,
                fileName: `${newFileName}.${fileType}`,
            }
        };
        const results = targetPath === "images" ? s3imageResults : fileResults;
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, results);
    }
    catch (error) {
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.awsUploadFromURL = awsUploadFromURL;
//# sourceMappingURL=awsUploadFromURL.js.map