import { Request, Response } from "express";
import { IFile } from "../types/express/index";

interface MulterRequest extends Request {
  file?: IFile;
}

export function fileAnalyze(req: MulterRequest, res: Response) {
  try {
    const { file } = req;

    if (!file) {
      console.log({ path: "first", file });
      return res
        .status(400)
        .json({ error: "A file is required in the form data." });
    }

    return res.status(200).json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });
  } catch (error) {
    console.log({ path: "second", error, file: req.file });
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}
