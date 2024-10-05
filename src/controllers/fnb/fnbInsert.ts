import express from "express";
import {
  status,
  message,
  responseHelper,
  insertNewDocument,
  bulkInsertDocument,
  readDocument,
  findOneDocument,
} from "../../_utils";
import { FNB, FNB_CATEGORIES } from "../../models";

export const fnbInsert = async (req: express.Request, res: express.Response) => {
  try {
    if (req.body.length !== undefined) {
      let resultsPool: any[] = [];
      for (let index = 0; index < req.body.length; index++) {
        const element = req.body[index];
        const category = await findOneDocument(FNB_CATEGORIES, { _id: element.category.id });

        const payload = {
          ...element,
          category: category.toJSON()
        };

        const bulkCreateResults = await bulkInsertDocument(FNB, payload);
        resultsPool.push(bulkCreateResults);
      }
      responseHelper(res, status.successCreate, message.successInsert, { length: resultsPool.length, data: resultsPool });
      return;
    }
    else {
      const request = req.body;
      const category = await findOneDocument(FNB_CATEGORIES, { _id: request.category.id });
      const payload = {
        ...request,
        category: category.toJSON()
      };
      const finalPayload = new FNB(payload);

      const results = await insertNewDocument(finalPayload);
      responseHelper(res, status.successCreate, message.successInsert, results);
      return;
    }
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};