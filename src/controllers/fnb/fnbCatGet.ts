import express from "express";
import {
  status,
  message,
  responseHelper,
  readDocument,
  readDocumentByModel,
} from "../../_utils";
import { FNB_CATEGORIES, FnBCategoryProps } from "../../models";
import { AnyObject, Collection, Model } from "mongoose";

export const fnbCatGet = async (req: express.Request, res: express.Response) => {
  try {
    const results = await readDocument<FnBCategoryProps>(FNB_CATEGORIES, {});
    responseHelper(res, status.success, message.onlySuccess, results);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};