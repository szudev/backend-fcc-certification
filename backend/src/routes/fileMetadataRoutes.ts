import express from "express";
import { fileAnalyze } from "../controllers/fileMetadataController";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/fileanalyse", upload.single("file"), fileAnalyze);

export default router;
