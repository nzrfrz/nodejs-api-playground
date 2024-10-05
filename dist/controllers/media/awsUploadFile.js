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
exports.awsUploadFile = exports.awsUploadMulter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const _utils_1 = require("../../_utils");
dotenv_1.default.config();
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   }
// });
const HD_WIDTH = 1280;
const HD_HEIGHT = 720;
const THUMBNAIL_WIDTH = HD_WIDTH / 10;
const THUMBNAIL_HEIGHT = HD_HEIGHT / 10;
const storage = multer_1.default.memoryStorage();
exports.awsUploadMulter = (0, multer_1.default)({ storage: storage });
const awsUploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(cryptojs.randomBytes(9).toString("hex"));
        const file = req.file;
        if (!file) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, null);
            return;
        }
        const { targetPath, thumbPath } = req.query;
        const newFileName = node_crypto_1.default.randomBytes(9).toString("hex");
        const fileType = file.originalname.split(".").slice(-1).shift();
        let targetFileBuffer;
        let uploadTargetFile;
        if (file.mimetype.startsWith('image/') && targetPath === "images") {
            const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
            const { width, height } = metadata;
            if (width > HD_WIDTH || height > HD_HEIGHT) {
                targetFileBuffer = yield (0, sharp_1.default)(file.buffer).resize(HD_WIDTH, HD_HEIGHT, { fit: "inside" }).toBuffer();
            }
            else
                targetFileBuffer = file.buffer;
            const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
            uploadTargetFile = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: targetImageKey,
                Body: targetFileBuffer,
                ContentType: file.mimetype,
            });
        }
        else if (!file.mimetype.startsWith('image/') && targetPath === "files") {
            targetFileBuffer = file.buffer;
            const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
            uploadTargetFile = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: targetImageKey,
                Body: targetFileBuffer,
                ContentType: file.mimetype,
            });
        }
        else {
            (0, _utils_1.responseHelper)(res, _utils_1.status.errorRequest, _utils_1.message.errorRequest, { status: 400, message: "You need to check the file type and the targetPath param" });
            return;
        }
        yield _utils_1.s3.send(uploadTargetFile);
        if (thumbPath !== "") {
            const thumbnailBuffer = yield (0, sharp_1.default)(file.buffer).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "inside" }).toBuffer();
            const thumbnailImageKey = `${targetPath}/${thumbPath}/${newFileName}.${fileType}`;
            const uploadThumbnailImage = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: thumbnailImageKey,
                Body: thumbnailBuffer,
                ContentType: file.mimetype,
            });
            yield _utils_1.s3.send(uploadThumbnailImage);
        }
        const imageResults = {
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
        const results = targetPath === "images" ? imageResults : fileResults;
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, results);
    }
    catch (error) {
        console.log(error);
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error);
    }
});
exports.awsUploadFile = awsUploadFile;
//# sourceMappingURL=awsUploadFile.js.map