import { Request, Response } from "express";
import {
  createExercise,
  createUser,
  getUserLogById,
  getUsers,
} from "../services/exerciseTrackerService";
import { isValidObjectId } from "mongoose";
import {
  formatStringToExerciseDate,
  validateExerciseDateFormat,
} from "../lib/utils";

export async function createNewUser(req: Request, res: Response) {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      if (!username)
        return res
          .status(400)
          .json({ error: "An username need to be added to the form data." });
      return res.status(400).json({ error: "username must be a string." });
    }

    const [error, newUser] = await createUser(username);

    if (error) return res.status(400).json({ error: error.message });
    if (!newUser) return res.status(401).json({ error: "User was not found." });

    return res
      .status(201)
      .json({ username: newUser.username, _id: newUser._id.toString() });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const [error, users] = await getUsers();
    if (error) return res.status(400).json({ error: error.message });
    if (!users)
      return res
        .status(401)
        .json({ error: "There was an error getting the users." });

    const formattedUsers = users.map((user) => {
      return { username: user.username, _id: user._id.toString() };
    });
    return res.status(200).json(formattedUsers);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}

export async function createNewExercise(req: Request, res: Response) {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    if (!isValidObjectId(_id))
      return res.status(400).json({ error: "The given id isn't a valid id." });

    if (date) {
      if (typeof date !== "string") {
        return res.status(400).json({ error: "date must be a string." });
      }
      if (!validateExerciseDateFormat(date)) {
        return res.status(400).json({
          error: "The date must have the following format: yyyy-mm-dd",
        });
      }
    }

    if (
      !description ||
      !duration ||
      typeof description !== "string" ||
      typeof duration !== "number"
    ) {
      if (!description || !duration) {
        return res.status(400).json({
          error: "A description and a duration must be in the form data.",
        });
      }
      if (
        typeof description !== "string" ||
        (typeof duration !== "number" && isNaN(Number(duration)))
      ) {
        return res.status(400).json({
          error: "Description must be a string, duration must be a number.",
        });
      }
    }

    const formattedDate = date ? formatStringToExerciseDate(date) : undefined;

    const [error, newExercise] = await createExercise({
      _id,
      description,
      duration,
      date: formattedDate,
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json(newExercise);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}

export async function getUserLog(req: Request, res: Response) {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    if (!isValidObjectId(_id)) {
      console.log({ path: "first", _id });
      return res.status(400).json({ error: "The given id isn't a valid id." });
    }

    const [error, userLog] = await getUserLogById({
      _id,
      from: from ? (from as string) : undefined,
      limit: limit ? (limit as string) : undefined,
      to: to ? (to as string) : undefined,
    });

    if (error) {
      console.log({ path: "second", error });
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(userLog);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : `Unkown error on ${req.path}`,
    });
  }
}
