import express from "express";
import {
  photoComment,
  photoCommentDelete,
  photoThumbsUp,
} from "../controllers/photoController";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/comment", deleteComment);

apiRouter.post("/photos/:id([0-9a-f]{24})/comment", photoComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", photoCommentDelete);

apiRouter.post("/photos/:id([0-9a-f]{24})/rating", photoThumbsUp);

export default apiRouter;
