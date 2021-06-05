import express from "express";
import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watchVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
