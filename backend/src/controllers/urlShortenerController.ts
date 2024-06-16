import { Request, Response } from "express";
import dns from "dns";
import {
  findUrl,
  findUrlById,
  saveNewUrl,
} from "../services/urlShortenerServices";
import { URL } from "url";

export function urlShortener(req: Request, res: Response) {
  try {
    const originalUrl = req.body.url;

    if (!originalUrl || typeof originalUrl !== "string") {
      console.log({ path: "first", originalUrl, body: req.body });
      return res
        .status(400)
        .json({ error: "An URL is needed in the request body." });
    }

    dns.lookup(new URL(originalUrl).hostname, async (err, address) => {
      if (!address || err) {
        console.log({ path: "second", originalUrl, body: req.body });
        return res.status(400).json({ error: "invalid url" });
      }

      const [error, searchedUrl] = await findUrl(originalUrl);
      if (error) {
        console.log({ path: "third", originalUrl, error: error.message });
        return res.status(400).json({ error: error.message });
      }

      if (searchedUrl) {
        return res.status(200).json({
          original_url: searchedUrl.originalUrl,
          short_url: searchedUrl._id,
        });
      } else {
        const [error, savedUrl] = await saveNewUrl(originalUrl);

        if (error) {
          console.log({ path: "four", originalUrl, error: error.message });
          return res.status(400).json({ error: error.message });
        }
        if (!savedUrl)
          return res
            .status(400)
            .json({ error: "Error on retriving the saved url" });

        return res.status(200).json({
          original_url: savedUrl.originalUrl,
          short_url: savedUrl._id,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}

export async function urlRedirect(req: Request, res: Response) {
  try {
    const { short_url } = req.params;

    if (!short_url)
      return res.status(400).json({ error: "A short URL is required." });

    const shortUrlId = parseInt(short_url, 10);
    if (isNaN(shortUrlId))
      return res
        .status(400)
        .json({ error: "Wrong format. Short url must be a number." });

    const [error, foundUrl] = await findUrlById(shortUrlId);

    if (error) return res.status(400).json({ error: error.message });

    if (foundUrl && foundUrl.originalUrl) {
      return res.redirect(foundUrl.originalUrl);
    } else {
      return res
        .status(404)
        .json({ error: "No short URL found for the given input" });
    }
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}
