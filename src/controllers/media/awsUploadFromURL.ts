import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import sharp from "sharp";
import cryptojs from "node:crypto";
import {
  s3,
  status,
  message,
  responseHelper,
} from "../../_utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const HD_WIDTH = 1280;
const HD_HEIGHT = 720;
const THUMBNAIL_WIDTH = HD_WIDTH / 10;
const THUMBNAIL_HEIGHT = HD_HEIGHT / 10;

export const awsUploadFromURL = async (req: express.Request, res: express.Response) => {
  try {
    const { imageURL, targetPath, thumbPath } = req.body;
    if (imageURL === "" || !imageURL) {
      responseHelper(res, status.errorRequest, message.errorRequest, null);
      return;
    }

    const imageResults = await axios.get(imageURL, { responseType: "arraybuffer" });
    const contentType = imageResults.headers["content-type"];
    const newFileName = cryptojs.randomBytes(9).toString("hex");
    const fileType = contentType.split("/")[1];
    
    let targetFileBuffer;
    let uploadTargetFile;
    if (contentType.startsWith('image/') && targetPath === "images") {
      const metadata = await sharp(imageResults.data).metadata();
      const { width, height } = metadata;
      if (width > HD_WIDTH || height > HD_HEIGHT) {
        targetFileBuffer = await sharp(imageResults.data).resize(HD_WIDTH, HD_HEIGHT, { fit: "inside" }).toBuffer();
      }
      else targetFileBuffer = imageResults.data;

      const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
      uploadTargetFile = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: targetImageKey,
        Body: targetFileBuffer,
        ContentType: contentType,
      });
    }
    else if (!contentType.startsWith('image/') && targetPath === "files") {
      targetFileBuffer = imageResults.data;
      const targetImageKey = `${targetPath}/${newFileName}.${fileType}`;
      uploadTargetFile = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: targetImageKey,
        Body: targetFileBuffer,
        ContentType: contentType,
      });
    }
    else {
      responseHelper(res, status.errorRequest, message.errorRequest, { status: 400, message: "You need to check the file type and the targetPath param" });
      return;
    }

    await s3.send(uploadTargetFile);

    if (thumbPath !== "") {
      const thumbnailBuffer = await sharp(imageResults.data).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "inside" }).toBuffer();
      const thumbnailImageKey = `${targetPath}/${thumbPath}/${newFileName}.${fileType}`;
      const uploadThumbnailImage = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: thumbnailImageKey,
        Body: thumbnailBuffer,
        ContentType: contentType,
      });
      await s3.send(uploadThumbnailImage);
    }

    const s3imageResults = {
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

    const results = targetPath === "images" ? s3imageResults : fileResults;

    responseHelper(res, status.success, message.onlySuccess, results);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};