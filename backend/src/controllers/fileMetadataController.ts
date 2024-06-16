import { Request, Response } from "express";
import { IFile } from "../types/express/index";

interface MulterRequest extends Request {
  file?: IFile;
}

export function fileAnalyze(req: MulterRequest, res: Response) {
  try {
    const { file } = req;

    if (!file)
      return res
        .status(400)
        .json({ error: "A file is required in the form data." });

    return res.json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}

export function renderPage(req: Request, res: Response) {
  res.sendFile(process.cwd() + "/views/index.html");
}
