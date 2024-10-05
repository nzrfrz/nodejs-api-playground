import express from "express";
import {
  status,
  message,
  responseHelper,
  findOneDocument,
  updateByID,
} from "../../_utils";
import { FNB, FNB_CATEGORIES } from "../../models";

export const fnbUpdate = async (req: express.Request, res: express.Response) => {
  try {
    const { itemID } = req.params;
    const category = await findOneDocument(FNB_CATEGORIES, { _id: req.body.category.id });
    const payload = {
      ...req.body,
      category: category.toJSON()
    };
    const updateResult = await updateByID(FNB, itemID, payload);
    responseHelper(res, status.success, message.successEdit, updateResult);
  } catch (error) { 
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};