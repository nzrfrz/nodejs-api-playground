import express from "express";
import { 
  fnbCatGet,
  fnbCatInsert,
  fnbDelete,
  fnbGet,
  fnbInsert,
  fnbUpdate,
} from "../controllers";

export default (router: express.Router) => {
  router.post("/fnb-category/insert/", fnbCatInsert);
  router.get("/fnb-category/get/", fnbCatGet);

  router.get("/fnb/get", fnbGet);
  router.post("/fnb/insert/", fnbInsert);
  router.put("/fnb/update/id=:itemID/", fnbUpdate);
  router.delete("/fnb/delete/id=:itemID/", fnbDelete);
};