import express from "express";
import {
  urlShortener,
  urlRedirect,
} from "../controllers/urlShortenerController";

const router = express.Router();

router.post("/shorturl", urlShortener);
router.get("/shorturl/:short_url", urlRedirect);

export default router;
