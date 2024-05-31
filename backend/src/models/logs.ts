import mongoose, { Schema, InferSchemaType, Types } from "mongoose";

const logSchema = new Schema({
  count: { type: Number, default: 0 },
  userId: { type: Types.ObjectId, required: true, unique: true },
  log: {
    type: [{ description: String, duration: Number, date: String }],
    default: [],
  },
});

const logModel = mongoose.model("logs", logSchema);

export type logModelType = InferSchemaType<typeof logSchema>;
export default logModel;
