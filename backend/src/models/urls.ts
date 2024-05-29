import mongoose, { Schema, InferSchemaType } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

const urlSchema = new Schema({
  _id: Number,
  originalUrl: {
    type: String,
    unique: true,
  },
});

urlSchema.plugin(AutoIncrementID, { startAt: 1 });
const urlModel = mongoose.model("urls", urlSchema);

export type urlModelType = InferSchemaType<typeof urlSchema>;
export default urlModel;
