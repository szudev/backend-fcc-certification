import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  timestampRouter,
  requestHeaderParserRouter,
  urlShortenerRouter,
  exerciseTrackerRouter,
  filMetadataRouter,
} from "./src/routes/routes";
import { Connect } from "./src/db.connection/connection";
import { renderPage } from "./src/controllers/fileMetadataController";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/", renderPage);
app.use("/api", requestHeaderParserRouter);
app.use("/api", urlShortenerRouter);
app.use("/api", exerciseTrackerRouter);
app.use("/api", filMetadataRouter);
app.use("/api", timestampRouter);

Connect();

app.listen(port, () => {
  console.log(`API is running on: http://localhost:${port}`);
});
