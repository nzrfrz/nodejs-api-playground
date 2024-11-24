"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
exports.default = (router) => {
    router.get("/region-data/countries-by-subregion/subregionId=:subregionId", controllers_1.countriesBySubregion);
    router.get("/region-data/states-by-country-code/iso2CountryCode=:iso2CountryCode", controllers_1.statesByCountryCode);
    router.get("/region-data/cities-by-country-state-code/iso2CountryCode=:iso2CountryCode/stateCode=:stateCode", controllers_1.citiesByCountryStateCode);
};
//# sourceMappingURL=regionDataRouter.js.map