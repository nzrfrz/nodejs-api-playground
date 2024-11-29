import axios from "axios";
import express from "express";
import {
  status,
  message,
  responseHelper,
} from "../../_utils";

export const countriesBySubregion = async (req: express.Request, res: express.Response) => {
  try {
    const { subregionId } = req.params;

    const basePath = process.env.REGION_DATA_BASE_PATH;
    const getCountries = await axios.get(`${basePath}/api/region-data/countries-by-subregion/subregionId=${subregionId}`);

    responseHelper(res, status.success, message.onlySuccess, getCountries.data.data);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};