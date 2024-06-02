import express from "express";
import {
  createNewUser,
  getAllUsers,
  createNewExercise,
  getUserLog,
} from "../controllers/exerciseTrackerController";
import ValidateGetUserLogQueryParams from "../middlewares/validateGetUserLogQueryParams";

const router = express.Router();

router.post("/users", createNewUser);
router.get("/users", getAllUsers);
router.post("/users/:_id/exercises", createNewExercise);
router.get("/users/:_id/logs", ValidateGetUserLogQueryParams, getUserLog);

export default router;
