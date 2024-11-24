import express from "express";
import {
  status,
  message,
  responseHelper,
  getRegionDB,
} from "../../_utils";

export const citiesByCountryStateCode = async (req: express.Request, res: express.Response) => {
  try {
    const regionDB = getRegionDB();
    const {iso2CountryCode, stateCode} = req.params;
    const citiesCollection = regionDB.collection("cities");
    const citiesList = await citiesCollection.find({ country_code: iso2CountryCode, state_code: stateCode }).toArray();

    responseHelper(res, status.success, message.onlySuccess, citiesList);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};