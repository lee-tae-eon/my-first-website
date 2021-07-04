import express from "express";
import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUpload,
  postUpload,
  deleteVideo,
  videoHome,
  videoSearch,
} from "../controllers/videoController";
import { protectMiddleWare, videoUploadMiddleWare } from "../middleWares";

const videoRouter = express.Router();

videoRouter.get("/", videoHome);
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
  .post(
    videoUploadMiddleWare.fields([
      { name: "videoFile" },
      { name: "thumbFile" },
    ]),
    postUpload
  );
videoRouter.get("/search", videoSearch);

export default videoRouter;
