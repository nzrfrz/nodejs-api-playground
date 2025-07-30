/**
 * Delete uploaded file based on file id and file types (alias).
 * This controller is using a request query to get the file id and file types (alias).
 * The Query = ?id=[FILE_ID]&type=[FILE_ALIAS + 's']
*/

import fs from "fs";
import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../../_utils";
import { getDestPathByFilename } from "../uploaderUtils/serverFileUploaderUtils";

export const serverDeleteFile = async (req: express.Request, res: express.Response) => {
  try {
    const { fileName } = req.query;

    const { fileUID, targetPath, originalFilePath, thumbnailPath } = getDestPathByFilename(fileName as string);
    await fs.promises.unlink(originalFilePath + "/" + fileName);

    if (targetPath === 'images') {
      const thumbFiles = await fs.promises.readdir(thumbnailPath, { withFileTypes: true });
      for (const thumbFile of thumbFiles) {
        if (thumbFile.name.includes(fileUID)) {
          await fs.promises.unlink(thumbnailPath + "/" + thumbFile.name);
        }
      }
    }

    responseHelper(res, status.success, "File has been deleted", null);
  } catch (error) {
    // console.log('server delete file: ', error);
    if (error.toString().includes('ENOENT') === true) {
      responseHelper(res, status.errorRequest, message.errorRequest, { message: 'No such file or directory' });
      return;
    }
    if (error.code === 'EBUSY') {
      responseHelper(res, status.errorServer, message.errorServer, { message: 'File is busy or locked. Please try again later.' });
      return;
    }
    responseHelper(res, status.errorServer, message.errorServer, { message: error.toString() });
  }
};