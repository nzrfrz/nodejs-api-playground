import dotenv from "dotenv";
import express from "express";
import {
  s3,
  status,
  message,
  responseHelper,
} from "../../_utils";
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

export const awsDeleteFile = async (req: express.Request, res: express.Response) => {
  try {
    const { targetPath, thumbPath, fileName } = req.query;

    const deleteTargetFile = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${targetPath}/${fileName}`,
    });

    await s3.send(deleteTargetFile);

    if (thumbPath !== "") {
      const deleteThumbFile = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${targetPath}/${thumbPath}/${fileName}`,
      });
      await s3.send(deleteThumbFile);
    }

    responseHelper(res, status.success, message.successDelete, null);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};