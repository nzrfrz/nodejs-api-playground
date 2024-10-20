import express from "express";

import {
  awsUploadMulter,
  awsUploadFile,
  awsDeleteFile,
  awsUploadFromURL,
  awsCheckExistingFile,
  checkUrlFileValidity,
} from "../controllers";

export default (router: express.Router) => {
  router.get("/s3-check/file", awsCheckExistingFile);
  router.post("/validity-check/file/url/", checkUrlFileValidity);
  router.post("/s3-upload/url/file/", awsUploadFromURL);
  router.post("/s3-upload/file", awsUploadMulter.single("file"), awsUploadFile);
  router.delete("/s3-delete/file", awsDeleteFile);
};