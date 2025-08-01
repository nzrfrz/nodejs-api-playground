import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import {
	status,
	message,
	responseHelper,
} from "../../_utils";
import { fileTypeList } from "./uploaderUtils/fileTypeList";
import { videoUploader } from "./uploaderUtils/videoUploader";
import { fileUploader } from "./uploaderUtils/fileUploader";
import { imageUploaderV2 } from "./uploaderUtils/imageUploaderV2";

dotenv.config();

const storage = multer.memoryStorage();
export const awsUploadMulterV2 = multer({ storage: storage });

export const awsUploadFileV2 = async (req: express.Request, res: express.Response) => {
	try {
		const { maxFileSize } = req.query;
    const file = req.file;
    if (!file) {
      responseHelper(res, status.errorRequest, message.errorRequest, null);
      return;
    }

		const DEFAULT_MAX_FILE_SIZE: number = 5; // remove this if not using vercel hobby plan
		const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

		let finalMaxFileSize;
		if (maxFileSize === '' || maxFileSize === 'undefined') finalMaxFileSize = DEFAULT_MAX_FILE_SIZE;
		else finalMaxFileSize = maxFileSize;

		if (sizeInMB > finalMaxFileSize) {
      responseHelper(res, status.errorRequest, message.errorRequest, { message: `File size is more than ${finalMaxFileSize}MB` });
      return;
		}

		const targetPath = fileTypeList.find((item) => item.mimeType === file.mimetype)?.alias + 's';

		if (targetPath === undefined) {
			responseHelper(res, status.errorRequest, 'File type not allowed', null);
			return;
		}

		let uploadResponse;
		switch (targetPath) {
			case 'images':
				// uploadResponse = await imageUploader(file, targetPath);
				uploadResponse = await imageUploaderV2(file, targetPath);
				break;
			case 'videos':
				uploadResponse = await videoUploader(file, targetPath);
				break;
			default:
				uploadResponse = await fileUploader(file, targetPath);
				break;
		}
		
		responseHelper(res, status.success, message.onlySuccess, uploadResponse);
	} catch (error) {
		console.log('s3 file uploader v2 error: ', error);
		responseHelper(res, status.errorServer, message.errorServer, error);
	}
};