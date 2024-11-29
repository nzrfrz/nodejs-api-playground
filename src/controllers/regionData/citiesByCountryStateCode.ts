import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";
import axios from "axios";

export const citiesByCountryStateCode = async (req: express.Request, res: express.Response) => {
  try {
    const {iso2CountryCode, stateCode} = req.params;

    const basePath = process.env.REGION_DATA_BASE_PATH;
    const getStates = await axios.get(`${basePath}/api/region-data/cities-by-country-state-code/iso2CountryCode=${iso2CountryCode}/stateCode=${stateCode}`);

    responseHelper(res, status.success, message.onlySuccess, getStates.data.data);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};