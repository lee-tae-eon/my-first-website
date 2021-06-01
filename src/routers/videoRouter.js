import express from "express";
import {
  watchVideo,
  editVideo,
  uploadVideo,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", uploadVideo);
videoRouter.get("/:id(\\d+)", watchVideo);
videoRouter.get("/:id(\\d+)/edit", editVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
