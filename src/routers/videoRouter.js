import express from "express";
import {
  watchVideo,
  uploadVideo,
  deleteVideo,
  getEditVideo,
  postEditVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watchVideo);
//- get & post방식을 같이 route할때는 이렇게 써도 무방하다~! 대신 같은 url을 쓸때.
videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);

export default videoRouter;
