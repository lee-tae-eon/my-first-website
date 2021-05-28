import express from "express";
import {
  watchAlbum,
  editAlbum,
  uploadAlbum,
  deleteAlbum,
} from "../controllers/albumController";

const albumRouter = express.Router();

albumRouter.get("/upload", uploadAlbum);
albumRouter.get("/:id(\\d+)", watchAlbum);
albumRouter.get("/:id(\\d+)/edit", editAlbum);
albumRouter.get("/:id(\\d+)/delete", deleteAlbum);

export default albumRouter;
