import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import {
	status,
	message,
	responseHelper,
} from "../../_utils";
import { fileTypeList } from "./uploaderUtils/fileTypeList";
import { imageUploader } from "./uploaderUtils/imageUploader";
import { videoUploader } from "./uploaderUtils/videoUploader";
import { fileUploader } from "./uploaderUtils/fileUploader";

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

		const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

		if ((maxFileSize !== '' || maxFileSize !== undefined) && sizeInMB > maxFileSize) {
      responseHelper(res, status.errorRequest, message.errorRequest, { message: `File size is more than ${maxFileSize}MB` });
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
				uploadResponse = await imageUploader(file, targetPath);
				break;
			case 'videos':
				uploadResponse = await videoUploader(file, targetPath);
				break;
			default:
				uploadResponse = await fileUploader(file, targetPath);
				break;
		}

		// console.log('target path: ', targetPath);
		console.log('max file size: ', maxFileSize);
		responseHelper(res, status.success, message.onlySuccess, uploadResponse);
	} catch (error) {
		console.log(error);
		responseHelper(res, status.errorServer, message.errorServer, error);
	}
};