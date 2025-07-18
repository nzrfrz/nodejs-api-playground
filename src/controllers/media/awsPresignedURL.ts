/**
 * Reserved for next development
*/

/*
import dotenv from "dotenv";
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";

dotenv.config();

export const gets3PresignedURL = async (req: express.Request, res: express.Response) => {
  try {
    const { fileName, fileType, maxFileSize } = req.query;
  } catch (error) {
    console.log('get s3 presigned url: ', error);
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};
*/