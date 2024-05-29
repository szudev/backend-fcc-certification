import { Request, Response } from "express";

export function RequestHeaderParser(req: Request, res: Response) {
  try {
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const language = req.headers["accept-language"];
    const software = req.headers["user-agent"];

    return res.status(200).json({ ipaddress: ipAddress, language, software });
  } catch (error) {
    return res
      .status(500)
      .json({
        error:
          error instanceof Error
            ? error.message
            : `Unkown error on ${req.path}`,
      });
  }
}
