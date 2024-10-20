import dotenv from "dotenv";
import express from "express";
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import {
  s3,
  status,
  message,
  responseHelper,
} from "../../_utils";
dotenv.config();

export const awsCheckExistingFile = async (req: express.Request, res: express.Response) => {
  try {
    const s3HeadObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${req.query.targetPath}/${req.query.objectKey}`,
    };

    const results = await s3.send(new HeadObjectCommand(s3HeadObjectParams));
    responseHelper(res, status.success, message.onlySuccess, results);
  } catch (error) {
    if (error.$metadata.httpStatusCode === 404) {
      responseHelper(res, status.notFound, "Object not found", null);
      return;
    }
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};