import express from "express";
import { 
  citiesByCountryStateCode,
  countriesBySubregion, 
  statesByCountryCode 
} from "../controllers";

export default (router: express.Router) => {
  router.get("/region-data/countries-by-subregion/subregionId=:subregionId", countriesBySubregion);
  router.get("/region-data/states-by-country-code/iso2CountryCode=:iso2CountryCode",statesByCountryCode);
  router.get("/region-data/cities-by-country-state-code/iso2CountryCode=:iso2CountryCode/stateCode=:stateCode",citiesByCountryStateCode);
};