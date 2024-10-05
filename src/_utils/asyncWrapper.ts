import express from "express";

export const asyncWrapper = (fn: Function) => (
  req: express.Request | undefined, 
  res: express.Response | undefined, 
  next: express.NextFunction | undefined,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};