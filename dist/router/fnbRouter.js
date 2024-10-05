"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
exports.default = (router) => {
    router.post("/fnb-category/insert/", controllers_1.fnbCatInsert);
    router.get("/fnb-category/get/", controllers_1.fnbCatGet);
    router.get("/fnb/get", controllers_1.fnbGet);
    router.post("/fnb/insert/", controllers_1.fnbInsert);
    router.put("/fnb/update/id=:itemID/", controllers_1.fnbUpdate);
    router.delete("/fnb/delete/id=:itemID/", controllers_1.fnbDelete);
};
//# sourceMappingURL=fnbRouter.js.map