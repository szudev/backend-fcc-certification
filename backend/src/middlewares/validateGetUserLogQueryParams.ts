import { Request, Response, NextFunction } from "express";
import { validateExerciseDateFormat } from "../lib/utils";

export default function ValidateGetUserLogQueryParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { from, to, limit } = req.query;

  if (from || to || limit) {
    if (from) {
      if (typeof from !== "string")
        return res
          .status(400)
          .json({ error: "The query param *from* must be a string" });
      if (!validateExerciseDateFormat(from))
        return res.status(400).json({
          error:
            "The query param *from* must have the following format: yyyy-mm-dd",
        });
    }
    if (to) {
      if (typeof to !== "string")
        return res
          .status(400)
          .json({ error: "The query param *to* must be a string" });
      if (!validateExerciseDateFormat(to))
        return res.status(400).json({
          error:
            "The query param *from* must have the following format: yyyy-mm-dd",
        });
    }
    if (limit) {
      if (typeof limit !== "string")
        return res.status(400).json({
          error:
            "The query param *limit* must be a number within double quotes",
        });
      if (isNaN(Number(limit))) {
        return res.status(400).json({
          error: "The query param *limit* must be a number",
        });
      } else {
        if (Number(limit) <= 0)
          return res
            .status(400)
            .json({ error: "The query param *limit* must be greater than 0" });
      }
    }
  }

  next();
}
