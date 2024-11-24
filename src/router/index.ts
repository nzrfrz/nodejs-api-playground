import express from "express";

import regionDataRouter from "./regionDataRouter";
import mediaRouter from "./mediaRouter";
import fnbRouter from "./fnbRouter";

const router = express.Router();

export default (): express.Router => {
  regionDataRouter(router);
  mediaRouter(router);
  fnbRouter(router);
  
  return router;
};