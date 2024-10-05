import express from "express";

import {
  awsUploadMulter,
  awsUploadFile,
  awsDeleteFile,
  awsUploadFromURL,
} from "../controllers";
import { asyncWrapper } from "../_utils";

export default (router: express.Router) => {
  router.post("/s3-upload/url/file/", awsUploadFromURL);
  router.post("/s3-upload/file", awsUploadMulter.single("file"), awsUploadFile);
  router.delete("/s3-delete/file", awsDeleteFile);
};