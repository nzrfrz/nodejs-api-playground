import dotenv from "dotenv";
import cryptojs from "node:crypto";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "../../../_utils";

dotenv.config();

export const fileUploader = async (file: Express.Multer.File, targetPath: string) => {
  const newFileName = cryptojs.randomBytes(9).toString("hex");

  const fileBuffer = file.buffer;
  const originalFileExtension = file.originalname.split('.').pop();
  const completeFileName = `${newFileName}.${originalFileExtension}`;
  const s3FileKey = `playground/${targetPath}/${completeFileName}`;

  let uploadResult = {
    fileName: '',
    originalFileURL: '',
  };

  const s3Object = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3FileKey,
    Body: fileBuffer,
    ContentType: file.mimetype,
  });

  await s3.send(s3Object);

  uploadResult.fileName = completeFileName;
  uploadResult.originalFileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`

  // console.log(s3Object);

  return uploadResult;
};