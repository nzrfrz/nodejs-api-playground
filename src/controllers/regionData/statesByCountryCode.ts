import axios from "axios";
import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";

export const statesByCountryCode = async (req: express.Request, res: express.Response) => {
  try {
    const { iso2CountryCode } = req.params;

    const basePath = process.env.REGION_DATA_BASE_PATH;
    const getStates = await axios.get(`${basePath}/api/region-data/states-by-country-code/iso2CountryCode=${iso2CountryCode}`);

    responseHelper(res, status.success, message.onlySuccess, getStates.data.data);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};