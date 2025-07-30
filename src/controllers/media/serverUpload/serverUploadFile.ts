/**
 * Server upload file API Controller using multer disk storage.
 * File size filter by request query, like maxFileSize.
 * Multer disk storage doesn't have a way to read the file metadata like file size on the go,
 * so the file needs to be store on the storage first then read its metadata,
 * and if the stored file exceeds the maxFileSize, then it will be deleted.
 * So, to lighten the server workload, file filter or file validation should be done on the front end first.
 * The Query = ?maxFileSize=
*/

import fs from "fs";
import mime from "mime";
import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import cryptojs from "node:crypto";
import AsyncLock from "async-lock";
import {
  status,
  message,
  responseHelper,
} from "../../../_utils";
import { fileTypeList } from "../uploaderUtils/fileTypeList";
import { imageThumbnailGenerator } from "../uploaderUtils/imageThumbnailGenerator";
import { isFileFormatAllowed, setDestinationPath } from "../uploaderUtils/serverFileUploaderUtils";

dotenv.config();

interface MulterFile extends Express.Multer.File {
  thumbnailPath?: string;
}

const lock = new AsyncLock();

const diskStorage = multer.diskStorage({
  destination: (_, file, cb) => {
    const destinationPath = setDestinationPath(file);
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath); // Specify the uploads folder
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = cryptojs.randomBytes(9).toString("hex");
    const sourceExtension = mime.extension(file.mimetype);
    const getFileFormatManually = fileTypeList.find((item) => item.mimeType === file.mimetype)?.fileType;
    const finalFileExtension = sourceExtension === undefined ? getFileFormatManually : sourceExtension;
    // console.log(file, '\n', sourceExtension);

    cb(null, `${uniqueSuffix}.${finalFileExtension}`);
    // cb(null, uniqueSuffix + "." + finalFileExtension);
  }
});

export const serverUploadMulter = multer({
  storage: diskStorage,
}).single('file');

export const serverUploadFile = async (req: express.Request, res: express.Response) => {
  if (!req.file) {
    responseHelper(res, status.errorRequest, message.errorRequest, { message: "No file uploaded" });
    return;
  }

  const fileLockKey = `file:${req.file.filename}`;
  try {
    await lock.acquire(fileLockKey, async () => {
      const protocol = req.protocol;
      const headersHost = req.headers.host;

      const { maxFileSize } = req.query;
      const fileName = req.file.filename;
      const destinationPath = setDestinationPath(req.file);
      const uploadedFileSize = Number((req.file.size / (1024 * 1024)).toFixed(2));

      if (maxFileSize !== '' && uploadedFileSize > Number(maxFileSize)) {
        await fs.promises.unlink(`${destinationPath}/${fileName}`);
        responseHelper(res, status.errorRequest, message.errorRequest, { message: `The file exceeds ${maxFileSize}MB` });
        return;
      }

      if (isFileFormatAllowed(req.file) === false) {
        await fs.promises.unlink(`${destinationPath}/${fileName}`);
        responseHelper(res, status.errorRequest, message.errorRequest, { message: `Not supported file format` });
        return;
      }

      const fileAlias = fileTypeList.find((item) => item.mimeType === req.file.mimetype).alias + 's';
      const fileId = req.file.filename.split(".")[0].toString();

      let originalFileURL;
      let thumbnailURL;
      if (fileAlias === 'images') {
        const thumbnailPath = await imageThumbnailGenerator(req.file);
        (req.file as MulterFile).thumbnailPath = thumbnailPath;
        originalFileURL = `${protocol}://${headersHost}/static-view/?id=${fileId}&type=${fileAlias}`;
        thumbnailURL = `${protocol}://${headersHost}/static-view-thumbnail/?id=${fileId}&type=${fileAlias}`;
      }
      else {
        originalFileURL = `${protocol}://${headersHost}/static-view/?id=${fileId}&type=${fileAlias}`
      }

      const responseData = {
        id: fileId,
        fileName: req.file.filename,
        originalFileURL,
        thumbnailURL
      };

      // console.log(req.file);
      responseHelper(res, status.success, message.onlySuccess, responseData);
    });
  } catch (error) {
    // console.log('server upload file: ', error);
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};