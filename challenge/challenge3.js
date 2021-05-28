// index.js------------------------------------------------------------------------------
// import express from "express";
// import globalRouter from "./routers/globalRouter";
// import userRouter from "./routers/userRouter";
// import storyRouter from "./routers/storyRouter";

// const app = express();

// app.use("/", globalRouter);
// app.use("/users", userRouter);
// app.use("/stories", storyRouter);
// // Codesanbox does not need PORT :)
// app.listen(() => console.log(`Listening!`));

// globalRouter.js -----------------------------------------------------------------------
// import express from "express";
// import { home, join, login } from "../controllers/userController";

// import { trending, newStory } from "../controllers/storyController";

// const globalRouter = express.Router();

// globalRouter.get("/", home);
// globalRouter.get("/trending", trending);
// globalRouter.get("/new", newStory);
// globalRouter.get("/join", join);
// globalRouter.get("/login", login);

// export default globalRouter;

// userRouter.js-------------------------------------------------------------------------------
// import express from "express";
// import {
//   userBase,
//   userProfile,
//   editProfile
// } from "../controllers/userController";

// const userRouter = express.Router();

// userRouter.get("/", userBase);
// userRouter.get("/:id", userProfile);
// userRouter.get("/:id/edit-profile", editProfile);

// export default userRouter;

// storyRouter.js-----------------------------------------------------------------------------
// import express from "express";
// import {
//   storyInfo,
//   editStory,
//   deleteStory
// } from "../controllers/storyController";

// const storyRouter = express.Router();

// storyRouter.get("/:id", storyInfo);
// storyRouter.get("/:id/edit", editStory);
// storyRouter.get("/:id/delete", deleteStory);

// export default storyRouter;

// userController.js-----------------------------------------------------------------------
// export const home = (req, res) =>
//   res.send("<h3>Welcome Kimchi Story~!~!~!</h3>");

// export const join = (req, res) => res.send("<h3>How about Join Us?</h3>");
// export const login = (req, res) =>
//   res.send("<h3>Please Login & enjoy story</h3>");

// export const userBase = (req, res) => res.send("<h3>It's You!!</h3>");
// export const userProfile = (req, res) =>
//   res.send("<h3>This page is your Profile</h3>");
// export const editProfile = (req, res) => res.send("<h3>Edit Your Profile</h3>");

// storyController.js-----------------------------------------------------------------------
// export const trending = (req, res) =>
//   res.send("<h3>Trending Story section</h3>");
// export const newStory = (req, res) => res.send("<h3>New Story section!!</h3>");

// export const storyInfo = (req, res) => res.send("<h3>Watch the Story</h3>");

// export const editStory = (req, res) => res.send("<h3>Editing Story</h3>");

// export const deleteStory = (req, res) =>
//   res.send("<h3>Are you sure? delete this Story?</h3>");
