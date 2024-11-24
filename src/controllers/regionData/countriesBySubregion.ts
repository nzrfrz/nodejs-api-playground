import express from "express";
import {
  status,
  message,
  responseHelper,
  getRegionDB,
} from "../../_utils";

export const countriesBySubregion = async (req: express.Request, res: express.Response) => {
  try {
    const regionDB = getRegionDB();
    const {subregionId} = req.params;
    const countriesCollection = regionDB.collection("countries");
    const countriesList = await countriesCollection.find({ subregion_id: subregionId }).toArray();

    responseHelper(res, status.success, message.onlySuccess, countriesList);
  } catch (error) {
    responseHelper(res, status.errorServer, message.errorServer, error.toString());
  }
};