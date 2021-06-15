import express from "express";
import {
  editUser,
  deleteUser,
  logout,
  userProfile,
  loginGithub,
  finishGithub,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", loginGithub);
userRouter.get("/github/finish", finishGithub);
userRouter.get("/:id", userProfile);

export default userRouter;
