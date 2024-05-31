import express from "express";
import {
  createNewUser,
  getAllUsers,
  createNewExercise,
} from "../controllers/exerciseTrackerController";

const router = express.Router();

router.post("/users", createNewUser);
router.get("/users", getAllUsers);
router.post("/users/:_id/exercises", createNewExercise);

export default router;
