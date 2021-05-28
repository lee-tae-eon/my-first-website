import express from "express";
import {
  editUser,
  deleteUser,
  logout,
  userProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/:id", userProfile);

export default userRouter;
