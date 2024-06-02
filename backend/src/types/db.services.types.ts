import { urlModelType } from "../models/urls";
import { userModelType } from "../models/users";
import { exerciseModelType } from "../models/exercises";
import { logModelType } from "../models/logs";
import { Document } from "mongoose";

type CreateExerciseReturnObject = { _id: string; date: string } & Omit<
  userModelType,
  "_id"
> &
  Omit<exerciseModelType, "userId" | "username" | "date">;
type LogReturnType = Omit<logModelType, keyof Document | "userId" | "date"> & {
  date: string;
};
type GetUserLogByIdReturnObject = Omit<userModelType, "_id"> & {
  count: number;
  _id: string;
} & { log: Array<LogReturnType> };

export type findUrlResult = [Error?, urlModelType?];
export type saveNewUrlResult = [Error?, urlModelType?];
export type createUserResult = [Error?, userModelType?];
export type getUsersResult = [Error?, userModelType[]?];
export type createExerciseResult = [Error?, CreateExerciseReturnObject?];
export type getUserLogByIdResult = [Error?, GetUserLogByIdReturnObject?];
