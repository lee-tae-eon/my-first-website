import express from "express";
import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectMiddleWare, videoUploadMiddleWare } from "../middleWares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watchVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleWare)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleWare)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectMiddleWare)
  .get(getUpload)
  .post(videoUploadMiddleWare.single("video-file"), postUpload);

export default videoRouter;
