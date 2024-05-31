import mongoose, { Schema, InferSchemaType, Types } from "mongoose";

const exerciseSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true },
});

const exerciseModel = mongoose.model("exercises", exerciseSchema);

export type exerciseModelType = InferSchemaType<typeof exerciseSchema>;
export default exerciseModel;
