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
exports.imageThumbnailGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const imageThumbnailGenerator = (file) => __awaiter(void 0, void 0, void 0, function* () {
    sharp_1.default.cache(false);
    sharp_1.default.cache({ files: 0 });
    try {
        const thumbnailDir = './uploads/images/thumbnails/';
        const thumbnailPath = path_1.default.join(thumbnailDir, `${file.filename.split('.')[0]}.webp`);
        yield fs_1.default.promises.mkdir(thumbnailDir, { recursive: true });
        const metadata = yield (0, sharp_1.default)(file.path).metadata();
        const { width, height } = metadata;
        const divisor = width / 128;
        const thumbMaxWidth = Math.floor(width / divisor);
        const thumbMaxHeight = Math.floor(height / divisor);
        yield (0, sharp_1.default)(file.path).resize(thumbMaxWidth, thumbMaxHeight, { fit: 'inside' }).webp().toFile(thumbnailPath);
        return thumbnailPath;
    }
    catch (error) {
        // console.log('image thumb generator MD error: ', error);
        throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
});
exports.imageThumbnailGenerator = imageThumbnailGenerator;
//# sourceMappingURL=imageThumbnailGenerator.js.map