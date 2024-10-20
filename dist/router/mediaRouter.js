"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
exports.default = (router) => {
    router.get("/s3-check/file", controllers_1.awsCheckExistingFile);
    router.post("/validity-check/file/url/", controllers_1.checkUrlFileValidity);
    router.post("/s3-upload/url/file/", controllers_1.awsUploadFromURL);
    router.post("/s3-upload/file", controllers_1.awsUploadMulter.single("file"), controllers_1.awsUploadFile);
    router.delete("/s3-delete/file", controllers_1.awsDeleteFile);
};
//# sourceMappingURL=mediaRouter.js.map