import express from "express";

import mediaRouter from "./mediaRouter";
import fnbRouter from "./fnbRouter";

const router = express.Router();

export default (): express.Router => {
  mediaRouter(router);
  fnbRouter(router);
  
  return router;
};