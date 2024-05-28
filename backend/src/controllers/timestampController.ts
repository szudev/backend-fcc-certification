import { Request, Response } from "express";
import { isValid, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function parseTimestamp(req: Request, res: Response) {
  const { date } = req.params;

  try {
    if (!date || date === "") {
      const nowDate = toZonedTime(new Date(), "Europe/London", {
        timeZone: "GMT",
      });
      return res.status(400).json({
        unix: nowDate.getTime(),
        utc: format(nowDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'"),
      });
    }

    const parsedDate = new Date(parseInt(date));

    if (!isValid(parsedDate)) {
      return res.status(400).json({ error: "Invalid Date" });
    }

    const unix = parsedDate.getTime();
    const utc = format(
      toZonedTime(parsedDate, "Europe/London", { timeZone: "GMT" }),
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
    );

    return res.status(200).json({ unix, utc });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unkown error.",
    });
  }
}
