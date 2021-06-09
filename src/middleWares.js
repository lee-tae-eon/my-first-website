import morgan from "morgan";

export const loggerMiddleWare = morgan("dev");

export const localsMiddleWare = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "gyumTube";
  res.locals.loggedInUser = req.session.user;
  next();
};
