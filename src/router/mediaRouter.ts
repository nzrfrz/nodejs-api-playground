import express from "express";

import {
  awsUploadMulter,
  awsUploadFile,
  awsDeleteFile,
  awsUploadFromURL,
  awsCheckExistingFile,
  checkUrlFileValidity,
  awsUploadFileV2,
  awsUploadMulterV2,
  awsDeleteFileV2,
  serverUploadMulter,
  serverUploadFile,
  serverDeleteFile,
  serverDeleteAllFile,
} from "../controllers";

export default (router: express.Router) => {
  router.get("/s3-check/file", awsCheckExistingFile);
  router.post("/validity-check/file/url/", checkUrlFileValidity);
  router.post("/s3-upload/url/file/", awsUploadFromURL);
  router.post("/s3-upload/file", awsUploadMulter.single("file"), awsUploadFile);
  router.delete("/s3-delete/file", awsDeleteFile);

  router.delete("/s3-delete-v2/file", awsDeleteFileV2);
  router.post('/s3-upload-v2/file', awsUploadMulterV2.single("file"), awsUploadFileV2);

  router.delete('/static-delete/file', serverDeleteFile);
  router.delete('/static-delete-all/file', serverDeleteAllFile);
  router.post('/server-upload/file', serverUploadMulter, serverUploadFile);
};