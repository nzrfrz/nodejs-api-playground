import dotenv from "dotenv";
import sharp from "sharp";
import cryptojs from "node:crypto";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "../../../_utils";

dotenv.config();

export const imageUploaderV2 = async (file: Express.Multer.File, targetPath: string) => {
  const newFileName = cryptojs.randomBytes(9).toString("hex");

  const metadata = await sharp(file.buffer).metadata();
  const { width, height } = metadata;
  const divisor = width / 256;
  const thumbMaxWidth = Math.floor(width / divisor);
  const thumbMaxHeight = Math.floor(height / divisor);
  const originalFileExtension = file.originalname.split('.').pop();

  const originalImageKey = `playground/${targetPath}/${newFileName}.${originalFileExtension}`;
  const thumbnailImageKey = `playground/${targetPath}/thumbnails/${newFileName}.webp`;
  const thumbnailImageBuffer = await sharp(file.buffer).resize(thumbMaxWidth, thumbMaxHeight, { fit: "inside" }).webp().toBuffer();

  const imageObjects = [
    {
      key: originalImageKey,
      body: file.buffer,
      contentType: file.mimetype
    },
    {
      key: thumbnailImageKey,
      body: thumbnailImageBuffer,
      contentType: 'image/webp'
    }
  ];

  let uploadResult = {
    fileName: '',
    thumbnailFileName: '',
    originalFileURL: '',
    thumbnailURL: '',
  };

  for (let i = 0; i < imageObjects.length; i++) {
    const element = imageObjects[i];

    const s3Object = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: element.key,
      Body: element.body,
      ContentType: element.contentType,
    });

    await s3.send(s3Object);

    uploadResult.fileName = originalImageKey.split('/').pop();
    uploadResult.thumbnailFileName = thumbnailImageKey.split('/').pop();
    uploadResult.originalFileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalImageKey}`;
    uploadResult.thumbnailURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailImageKey}`
  }

  return uploadResult;
};