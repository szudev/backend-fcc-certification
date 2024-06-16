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
    const isValidUnixNumber = /^[0-9]+$/.test(date);

    if (parsedDate) {
      const toDate = new Date(date);
      const unix = toDate.valueOf();
      const utc = toDate.toUTCString();

      return res.status(200).json({ unix, utc });
    } else if (isNaN(parsedDate) && isValidUnixNumber) {
      const toDate = new Date(parseInt(date));
      const unix = toDate.valueOf();
      const utc = toDate.toUTCString();

      return res.status(200).json({ unix, utc });
    } else {
      return res.status(400).json({ error: "Invalid Date" });
    }
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unkown error.",
    });
  }
}
