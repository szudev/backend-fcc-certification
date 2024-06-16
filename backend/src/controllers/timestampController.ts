import { Request, Response } from "express";

export function parseTimestamp(req: Request, res: Response) {
  const { date } = req.params;

  try {
    if (!date || date === "") {
      const nowDate = new Date();
      return res.status(200).json({
        unix: nowDate.valueOf(),
        utc: nowDate.toUTCString(),
      });
    }

    const parsedDate = Date.parse(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid Date" });
    }

    const isValidUnixNumber = /^[0-9]+$/.test(date);
    if (!isValidUnixNumber)
      return res.status(400).json({ error: "Invalid Date" });

    const toDate = new Date(parseInt(date));
    const unix = toDate.valueOf();
    const utc = toDate.toUTCString();

    return res.status(200).json({ unix, utc });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unkown error.",
    });
  }
}
