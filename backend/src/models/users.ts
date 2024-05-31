import mongoose, { Schema, InferSchemaType, Types } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
});

const userModel = mongoose.model("users", userSchema);

export type userModelType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};
export default userModel;
