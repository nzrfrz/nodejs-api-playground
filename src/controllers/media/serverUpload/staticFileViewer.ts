import fs from "fs";
import mime from "mime";
import express from "express";
import {
  status,
  message,
  responseHelper
} from "../../../_utils";

export const staticFileViewer = async (req: express.Request, res: express.Response) => {
  const parentPath = './uploads';
  const { id, type } = req.query;

  if (!id || !type) {
    responseHelper(res, status.errorRequest, message.errorRequest, { message: 'Missing file id or type query params' });
    return;
  }

  try {
    const fullPath = `${parentPath}/${type}`;
    const readDirectory = await fs.promises.readdir(fullPath);
    const selectedFile = readDirectory.filter((data) => data.split(".")[0] === id)[0];

    if (!selectedFile) {
      responseHelper(res, status.notFound, 'File not found', null);
      return;
    }

    const filePath = `${fullPath}/${selectedFile}`;
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(filePath);

    res.setHeader("Content-Type", mimeType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(fileBuffer);
  } catch (error) {
    console.error("Error in staticFileViewer:", error);
    responseHelper(res, status.errorServer, message.errorServer, null);
  }
};