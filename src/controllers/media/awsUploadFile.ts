import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import sharp from "sharp";
import cryptojs from "node:crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
  s3,
  status,
  message,
  responseHelper,
} from "../../_utils";
dotenv.config();

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   }
// });

const HD_WIDTH = 1280;
const HD_HEIGHT = 720;
const THUMBNAIL_WIDTH = HD_WIDTH / 10;
const THUMBNAIL_HEIGHT = HD_HEIGHT / 10;

const storage = multer.memoryStorage();
export const awsUploadMulter = multer({ storage: storage });

export const awsUploadFile = async (req: express.Request, res: express.Response) => {
  try {

    // console.log(cryptojs.randomBytes(9).toString("hex"));
    const file = req.file;
    if (!file) {
      responseHelper(res, status.errorRequest, message.errorRequest, null);
      return;
    }

    const { targetPath, thumbPath } = req.query;
    const newFileName = cryptojs.randomBytes(9).toString("hex");
    const fileType = file.originalname.split(".").slice(-1).shift();

    let targetFileBuffer;
    let uploadTargetFile;
    if (file.mimetype.startsWith('image/') && targetPath === "images") {
      const metadata = await sharp(file.buffer).metadata();
      const { width, height } = metadata;
      if (width > HD_WIDTH || height > HD_HEIGHT) {
        targetFileBuffer = await sharp(file.buffer).resize(HD_WIDTH, HD_HEIGHT, { fit: "inside" }).toBuffer();
      }
      else targetFileBuffer = file.buffer;

      const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
      uploadTargetFile = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: targetImageKey,
        Body: targetFileBuffer,
        ContentType: file.mimetype,
      });
    }
    else if (!file.mimetype.startsWith('image/') && targetPath === "files") {
      targetFileBuffer = file.buffer;
      const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
      uploadTargetFile = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: targetImageKey,
        Body: targetFileBuffer,
        ContentType: file.mimetype,
      });
    }
    else {
      responseHelper(res, status.errorRequest, message.errorRequest, { status: 400, message: "You need to check the file type and the targetPath param" });
      return;
    }

    await s3.send(uploadTargetFile);

    if (thumbPath !== "") {
      const thumbnailBuffer = await sharp(file.buffer).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "inside" }).toBuffer();
      const thumbnailImageKey = `${targetPath}/${thumbPath}/${newFileName}.${fileType}`;
      const uploadThumbnailImage = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: thumbnailImageKey,
        Body: thumbnailBuffer,
        ContentType: file.mimetype,
      });
      await s3.send(uploadThumbnailImage);
    }

    const imageResults = {
      image: {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${newFileName}.${fileType}`,
        thumbnailUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${thumbPath}/${newFileName}.${fileType}`,
        fileName: `${newFileName}.${fileType}`,
      }
    };

    const fileResults = {
      file: {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${targetPath}/${newFileName}.${fileType}`,
        fileName: `${newFileName}.${fileType}`,
      }
    };

    const results = targetPath === "images" ? imageResults : fileResults;

    responseHelper(res, status.success, message.onlySuccess, results);
  } catch (error) {
    console.log(error);
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};