import express from "express";
import { parseTimestamp } from "../controllers/timestampController";

const router = express.Router();

router.get("/:date?", parseTimestamp);

export default router;
