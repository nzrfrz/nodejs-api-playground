import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";
dotenv.config();

export const checkUrlFileValidity = async (req: express.Request, res: express.Response) => {
  try {
    const results = await axios.get(req.body.url);
    const fetchResults = {
      fetchStatus: results.status,
      message: results.statusText,
    };
    responseHelper(res, status.success, message.onlySuccess, fetchResults);
  } catch (error) {
    if (error.status === 404) {
      const errorResults = {
        fetchStatus: error.status,
        message: "File not found",
      };
      responseHelper(res, status.notFound, message.errorRequest, errorResults);
      return;
    }
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};