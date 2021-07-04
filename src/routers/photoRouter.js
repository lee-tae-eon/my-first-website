import express from "express";
import {
  getPhotoUpload,
  photoHome,
  photoView,
  postPhotoUpload,
  getEditPhoto,
  postEditPhoto,
  deletePhoto,
  photoSearch,
} from "../controllers/photoController";
import { photoUploadMiddleWare, protectMiddleWare } from "../middleWares";

const photoRouter = express.Router();

photoRouter.get("/", photoHome);
photoRouter
  .route("/upload")
  .all(protectMiddleWare)
  .get(getPhotoUpload)
  .post(photoUploadMiddleWare.single("photoFile"), postPhotoUpload);
photoRouter.get("/:id([0-9a-f]{24})", photoView);
photoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleWare)
  .get(getEditPhoto)
  .post(postEditPhoto);
photoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleWare)
  .get(deletePhoto);
photoRouter.get("/search", photoSearch);

export default photoRouter;
