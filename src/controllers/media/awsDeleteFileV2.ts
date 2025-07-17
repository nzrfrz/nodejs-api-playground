import dotenv from "dotenv";
import express from "express";
import {
  s3,
  status,
  message,
  responseHelper,
} from "../../_utils";
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeList } from "./uploaderUtils/fileTypeList";

dotenv.config();

export const awsDeleteFileV2 = async (req: express.Request, res: express.Response) => {
  try {
    const { fileName } = req.query;
    if (!fileName || typeof fileName !== 'string') {
      responseHelper(res, status.errorRequest, message.errorRequest, { message: 'File Name (fileName) in url query required' });
      return;
    }

    const splitFileName = fileName.split('.');
    const fileExtension = `.${splitFileName[splitFileName.length - 1]}`;
    const awsTargetPath = fileTypeList.find((item) => item.fileType === fileExtension).alias + 's';
    const awsCompleteTargetPath = `playground/${awsTargetPath}/${fileName}`;

    const deleteTargetFile = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: awsCompleteTargetPath,
    });

    await s3.send(deleteTargetFile);

    if (awsTargetPath === 'images') {
      const deleteThumbnailImage = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `playground/${awsTargetPath}/thumbnails/${splitFileName[0]}.webp`,
      });

      await s3.send(deleteThumbnailImage);
    }

    // console.log(awsTargetPath);
    responseHelper(res, status.success, message.successDelete, null);
  } catch (error) {
    // console.log('aws delete file v2: ', error);    
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};