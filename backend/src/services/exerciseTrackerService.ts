import userModel from "../models/users";
import exerciseModel from "../models/exercises";
import logModel from "../models/logs";
import {
  createExerciseResult,
  createUserResult,
  getUsersResult,
} from "../types/db.services.types";
import { createCurrentDateAndFormat } from "../lib/utils";
import mongoose, { ClientSession } from "mongoose";

type CreateExerciseProps = {
  _id: string;
  description: string;
  duration: number;
  date?: string | undefined;
};

export async function createUser(username: string): Promise<createUserResult> {
  let session: ClientSession | null = null;

  try {
    //We start a transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const newUser = await userModel.create({ username });
    await newUser.save();

    const newLog = await logModel.create({ userId: newUser._id.toString() });
    await newLog.save();

    //We finish the transaction
    await session.commitTransaction();
    session.endSession();

    return [undefined, newUser];
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

    const updateOperation = await logModel.updateOne(
      { userId: foundUser._id },
      {
        $inc: { count: 1 },
        $push: {
          log: {
            description: newExercise.description,
            duration: newExercise.duration,
            date: newExercise.date,
          },
        },
      }
    );

    if (updateOperation.modifiedCount === 0) {
      await session.commitTransaction();
      session.endSession();
      return [
        new Error(
          "An unexpected error occurred when trying to add the exercise to the user log."
        ),
        undefined,
      ];
    }

    const formattedExercise = {
      _id: newExercise.userId.toString(),
      username: foundUser.username,
      date: newExercise.date,
      duration,
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
    [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on createExercise service."
      ),
      undefined,
    ];
  }
}

export async function getUserLogById(id: string) {
  try {
    return id;
  } catch (error) {
    [
      new Error(
        error instanceof Error
          ? error.message
          : "Unkown error on createExercise service."
      ),
      undefined,
    ];
  }
}
