import dotenv from "dotenv";
import sharp from "sharp";
import cryptojs from "node:crypto";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "../../../_utils";

dotenv.config();

export const imageUploader = async (file: Express.Multer.File, targetPath: string) => {
  const maxWidth = 1920;
  const maxHeight = 1080;
  const newFileName = cryptojs.randomBytes(9).toString("hex");

  const isGIF = file.mimetype === 'image/gif';
  const isSVG = file.mimetype === 'image/svg+xml';

  const metadata = await sharp(file.buffer).metadata();
  const { width, height } = metadata;
  const divisor = width / 256;
  const thumbMaxWidth = Math.floor(width / divisor);
  const thumbMaxHeight = Math.floor(height / divisor);
  const originalFileExtension = file.originalname.split('.').pop();

  let imageBuffer;

  let originalImageFileBuffer;
  if (isGIF === true) originalImageFileBuffer = await sharp(file.buffer, { animated: true }).gif().toBuffer();
  else if (isSVG === true) originalImageFileBuffer = file.buffer;
  else originalImageFileBuffer = await sharp(file.buffer).webp().toBuffer();

  // const bufferForGIF = await sharp(file.buffer, { animated: true }).resize(maxWidth, maxHeight, { fit: "inside" }).gif().toBuffer();
  const bufferForGIF = await sharp(file.buffer, { animated: true }).gif().toBuffer();
  const bufferForOther = await sharp(file.buffer).resize(maxWidth, maxHeight, { fit: "inside" }).webp().toBuffer();
  const finalImageBuffer = isGIF === false ? bufferForOther : bufferForGIF

  if (width > maxWidth || height > maxHeight) imageBuffer = finalImageBuffer;
  else imageBuffer = originalImageFileBuffer;
  
  let originalImageKey = '';
  if (isGIF === true || isSVG === true) originalImageKey = `playground/${targetPath}/${newFileName}.${originalFileExtension}`;
  else originalImageKey = `playground/${targetPath}/${newFileName}.webp`;

  const thumbnailImageKey = `playground/${targetPath}/thumbnails/${newFileName}.webp`;
  const thumbnailImageBuffer = await sharp(file.buffer).resize(thumbMaxWidth, thumbMaxHeight, { fit: "inside" }).webp().toBuffer();

  let originalContentType = '';
  if (isGIF === true) originalContentType = 'image/gif';
  else if (isSVG === true) originalContentType = 'image/svg+xml';
  else originalContentType = `image/webp`;

  const imageObjects = [
    {
      key: originalImageKey,
      body: imageBuffer,
      contentType: originalContentType
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