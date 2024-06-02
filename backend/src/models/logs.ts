import mongoose, {
  Schema,
  InferSchemaType,
  Types,
  Document,
  SchemaDefinitionProperty,
} from "mongoose";

export interface ILog extends Document {
  userId: Types.ObjectId | SchemaDefinitionProperty;
  description: string;
  duration: number;
  date: Date;
}

const logSchema = new Schema<ILog>({
  userId: { type: Types.ObjectId, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const logModel = mongoose.model<ILog>("logs", logSchema);

export type logModelType = InferSchemaType<typeof logSchema>;
export default logModel;
