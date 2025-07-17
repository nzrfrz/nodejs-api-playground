/** 
 * This code is the same as the fileUploader, but for this module need further development
 * like read the video then upscale or downscale, create automatic thumbnail from video
 * just like youtube content uploader 
*/

import dotenv from "dotenv";
import cryptojs from "node:crypto";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "../../../_utils";

dotenv.config();

export const videoUploader = async (file: Express.Multer.File, targetPath: string) => {
  const newFileName = cryptojs.randomBytes(9).toString("hex");

  const videoFileBuffer = file.buffer;
  const originalFileExtension = file.originalname.split('.').pop();
  const completeFileName = `${newFileName}.${originalFileExtension}`;
  const s3VideoKey = `playground/${targetPath}/${completeFileName}`;

  let uploadResult = {
    fileName: '',
    originalFileURL: '',
  };

  const s3Object = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3VideoKey,
    Body: videoFileBuffer,
    ContentType: file.mimetype,
  });

  await s3.send(s3Object);

  uploadResult.fileName = completeFileName;
  uploadResult.originalFileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3VideoKey}`

  // console.log(s3Object);

  return uploadResult;
};