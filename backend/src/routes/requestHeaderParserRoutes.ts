import express from "express";
import { RequestHeaderParser } from "../controllers/requestHeaderParserController";

const router = express.Router();

router.get("/whoami", RequestHeaderParser);

export default router;
