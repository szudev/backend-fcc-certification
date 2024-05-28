import express from "express";
import cors from "cors";
import { timestampRouter } from "./src/routes/routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/api", timestampRouter);

app.listen(port, () => {
  console.log(`API is running on: http://localhost:${port}`);
});
