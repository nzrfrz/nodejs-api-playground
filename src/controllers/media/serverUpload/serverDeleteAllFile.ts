import fs from "fs";
import path from "path";
import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../../_utils";

export const serverDeleteAllFile = async (req: express.Request, res: express.Response) => {
  try {
    const parentPath = './uploads';
    const readParentDir = await fs.promises.readdir(parentPath, { withFileTypes: true });

    let deletedFiles: string[] = [];
    for (const dirEntry of readParentDir) {
      /** Skip if it's not a directory or if it's the thumbnails directory */
      if (!dirEntry.isDirectory() || dirEntry.name === 'thumbnails') continue;

      const dirPath = path.join(parentPath, dirEntry.name);
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const file of files) {
        /** Skip .txt files and thumbnails directory */
        if (file.name.endsWith('.txt')) continue;

        if (dirEntry.name === 'images' && file.name === 'thumbnails') {
          const thumbnailPath = path.join(dirPath, 'thumbnails');
          const thumbnailFiles = await fs.promises.readdir(thumbnailPath, { withFileTypes: true });
          for (const thumbFile of thumbnailFiles) {
            if (thumbFile.name.endsWith('.txt')) continue;
            const thumbFilePath = path.join(thumbnailPath, thumbFile.name);
            await fs.promises.unlink(thumbFilePath);
            deletedFiles.push(thumbFile.name);
          }
          continue;
        }

        const filePath = path.join(dirPath, file.name);
        await fs.promises.unlink(filePath);
        deletedFiles.push(file.name);
        // console.log('original files: ', file.name);
      }
    }

    // console.log('server delete all file: ', deletedFiles.length);
    responseHelper(res, status.success, message.successDelete, { message: `${deletedFiles.length} file(s) has been deleted.` });
  } catch (error) {
    // console.log('server delete file: ', error);
    responseHelper(res, status.errorServer, message.errorServer, null);
  }
};