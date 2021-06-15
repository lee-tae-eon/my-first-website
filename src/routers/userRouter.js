import express from "express";
import {
  deleteUser,
  logout,
  loginGithub,
  finishGithub,
  getEditUser,
  postEditUser,
  getChangePwd,
  postChangePwd,
} from "../controllers/userController";
import { protectMiddleWare, publicOnlyMiddleWare } from "../middleWares";

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleWare, logout);
userRouter
  .route("/edit")
  .all(protectMiddleWare)
  .get(getEditUser)
  .post(postEditUser);
userRouter
  .route("/change-password")
  .all(protectMiddleWare)
  .get(getChangePwd)
  .post(postChangePwd);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleWare, loginGithub);
userRouter.get("/github/finish", publicOnlyMiddleWare, finishGithub);

export default userRouter;
