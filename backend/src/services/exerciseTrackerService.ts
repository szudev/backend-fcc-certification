import userModel from "../models/users";
import exerciseModel from "../models/exercises";
import logModel, { ILog } from "../models/logs";
import {
  createExerciseResult,
  createUserResult,
  getUsersResult,
  getUserLogByIdResult,
} from "../types/db.services.types";
import {
  createCurrentDateAndFormat,
  formatExerciseDateToString,
  formatStringToExerciseDate,
} from "../lib/utils";
import mongoose, { ClientSession, Types } from "mongoose";

type CreateExerciseProps = {
  _id: string;
  description: string;
  duration: number;
  date?: Date | undefined;
};

type GetUserLogByIdProps = {
  _id: string;
  from?: string | undefined;
  to?: string | undefined;
  limit?: string | undefined;
};

export async function createUser(username: string): Promise<createUserResult> {
  try {
    const newUser = await userModel.create({ username });
    await newUser.save();

    return [undefined, newUser];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on findUrl service."
      ),
      undefined,
    ];
  }
}

export async function getUsers(): Promise<getUsersResult> {
  try {
    const users = await userModel.find();
    return [undefined, users];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on findUrl service."
      ),
      undefined,
    ];
  }
}

export async function createExercise({
  _id,
  description,
  duration,
  date,
}: CreateExerciseProps): Promise<createExerciseResult> {
  let session: ClientSession | null = null;

  try {
    //We start a transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const foundUser = await userModel.findById(_id);
    if (!foundUser)
      return [
        new Error(`The user with the id: ${_id} doesnt exist.`),
        undefined,
      ];

    const newExercise = await exerciseModel.create({
      userId: _id,
      username: foundUser.username,
      description,
      duration,
      date: date ? date : createCurrentDateAndFormat(),
    });
    await newExercise.save();

    const newLog = await logModel.create({
      userId: _id,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date,
    });
    await newLog.save();

    const formattedExercise = {
      _id: newExercise.userId.toString(),
      username: foundUser.username,
      date: formatExerciseDateToString(newExercise.date),
      duration: newLog.duration,
      description,
    };

    //We finish the transaction
    await session.commitTransaction();
    session.endSession();

    return [undefined, formattedExercise];
  } catch (error) {
    if (session) {
      //If any error happen, we abort the transaction
      //to prevent any unfinished operations
      await session.abortTransaction();
      session.endSession();
    }
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on createExercise service."
      ),
      undefined,
    ];
  }
}

export async function getUserLogById({
  _id,
  from,
  limit,
  to,
}: GetUserLogByIdProps): Promise<getUserLogByIdResult> {
  try {
    const userToFind = await userModel.findById(_id);

    if (!userToFind)
      return [
        new Error(`The user with the id: ${_id} doesnt exist.`),
        undefined,
      ];

    const fromDate = from ? formatStringToExerciseDate(from) : undefined;
    const toDate = to ? formatStringToExerciseDate(to) : undefined;

    const pipeline = [
      { $match: { userId: new Types.ObjectId(_id) } },
      ...(fromDate ? [{ $match: { date: { $gte: fromDate } } }] : []),
      ...(toDate ? [{ $match: { date: { $lte: toDate } } }] : []),
      ...(limit ? [{ $limit: Number(limit) }] : []),
    ];

    const userLogs: Array<ILog> = await logModel.aggregate(pipeline);
    const formarttedUserLogs = userLogs.map((log) => {
      return {
        description: log.description,
        duration: log.duration,
        date: formatExerciseDateToString(log.date),
      };
    });

    const formattedLog = {
      username: userToFind.username,
      count: userLogs.length,
      _id: _id,
      log: formarttedUserLogs,
    };

    return [undefined, formattedLog];
  } catch (error) {
    return [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on createExercise service."
      ),
      undefined,
    ];
  }
}
