import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";
import { fnbPaginatedQuery } from "./_fnbPaginatedQuery";

export const fnbGet = async (req: express.Request, res: express.Response) => {
  try {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page) - 1;
    const availability = req.query.status;
    const searchValue = req.query.q;

    if (Number.isNaN(limit) === true || Number.isNaN(page) === true || searchValue === undefined || availability === undefined) {
      responseHelper(res, status.errorRequest, message.errorRequest, { message: "Query string cannot be empty" });
      return;
    }
    else {
      const results = await fnbPaginatedQuery(page, limit, availability as string, searchValue as string);
      responseHelper(res, status.success, message.onlySuccess, results);
      return;
    }
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error);
  }
};