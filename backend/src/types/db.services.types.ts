import { urlModelType } from "../models/urls";
import { userModelType } from "../models/users";
import { exerciseModelType } from "../models/exercises";

type CreateExerciseReturnObject = { _id: string } & Omit<userModelType, "_id"> &
  Omit<exerciseModelType, "userId" | "username">;

export type findUrlResult = [Error?, urlModelType?];
export type saveNewUrlResult = [Error?, urlModelType?];
export type createUserResult = [Error?, userModelType?];
export type getUsersResult = [Error?, userModelType[]?];
export type createExerciseResult = [Error?, CreateExerciseReturnObject?];
