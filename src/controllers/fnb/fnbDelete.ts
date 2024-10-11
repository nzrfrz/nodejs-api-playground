import express from "express";
import {
  status,
  message,
  responseHelper,
  deleteAll,
  deleteByID,
  findOneDocument,
} from "../../_utils";
import { FNB } from "../../models";

export const fnbDelete = async (req: express.Request, res: express.Response) => {
  try {
    const { itemID } = req.params;
    const prevFnB = await findOneDocument(FNB, { _id: itemID });
    if (prevFnB.editable === false) {
      responseHelper(res, status.forbidden, "You are not authorized to do this action!", null);
      return;
    }

    if (itemID === "all") {
      const results = await deleteAll(FNB);
      responseHelper(res, status.success, message.successDelete, results);
      return;
    }
    else {
      const results = await deleteByID(FNB, itemID);
      responseHelper(res, status.success, message.successDelete, results);
      return;
    }
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};