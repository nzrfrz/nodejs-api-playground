"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
exports.default = (router) => {
    router.get("/s3-check/file", controllers_1.awsCheckExistingFile);
    router.post("/validity-check/file/url/", controllers_1.checkUrlFileValidity);
    router.post("/s3-upload/url/file/", controllers_1.awsUploadFromURL);
    router.post("/s3-upload/file", controllers_1.awsUploadMulter.single("file"), controllers_1.awsUploadFile);
    router.delete("/s3-delete/file", controllers_1.awsDeleteFile);
    router.delete("/s3-delete-v2/file", controllers_1.awsDeleteFileV2);
    router.post('/s3-upload-v2/file', controllers_1.awsUploadMulterV2.single("file"), controllers_1.awsUploadFileV2);
    router.delete('/static-delete/file', controllers_1.serverDeleteFile);
    router.delete('/static-delete-all/file', controllers_1.serverDeleteAllFile);
    router.post('/server-upload/file', controllers_1.serverUploadMulter, controllers_1.serverUploadFile);
};
//# sourceMappingURL=mediaRouter.js.map