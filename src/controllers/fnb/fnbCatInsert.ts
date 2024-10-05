import express from "express";
import {
  status,
  message,
  responseHelper,
  insertNewDocument,
} from "../../_utils";
import { FNB_CATEGORIES } from "../../models";

export const fnbCatInsert = async (req: express.Request, res: express.Response) => {
  try {
    const payload = new FNB_CATEGORIES({ ...req.body });
    const results = await insertNewDocument(payload);
    responseHelper(res, status.successCreate, message.successInsert, results);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};
