import morgan from "morgan";
import multer from "multer";

const megaByte = 1000000;

export const loggerMiddleWare = morgan("dev");

export const localsMiddleWare = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "gyumTube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectMiddleWare = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleWare = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUploadMiddleWare = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: megaByte * 10,
  },
});

export const videoUploadMiddleWare = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: megaByte * 30,
  },
});
