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
exports.awsCheckExistingFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const _utils_1 = require("../../_utils");
dotenv_1.default.config();
const awsCheckExistingFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3HeadObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${req.query.targetPath}/${req.query.objectKey}`,
        };
        const results = yield _utils_1.s3.send(new client_s3_1.HeadObjectCommand(s3HeadObjectParams));
        (0, _utils_1.responseHelper)(res, _utils_1.status.success, _utils_1.message.onlySuccess, results);
    }
    catch (error) {
        if (error.$metadata.httpStatusCode === 404) {
            (0, _utils_1.responseHelper)(res, _utils_1.status.notFound, "Object not found", null);
            return;
        }
        (0, _utils_1.responseHelper)(res, _utils_1.status.errorServer, _utils_1.message.errorServer, error.toString());
    }
});
exports.awsCheckExistingFile = awsCheckExistingFile;
//# sourceMappingURL=awsCheckExistingFile.js.map