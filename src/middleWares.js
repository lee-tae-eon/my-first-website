import morgan from "morgan";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const megaByte = 1000000;

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerS3Uploader = multerS3({
  s3: s3,
  bucket: "gyumtube",
  acl: "public-read",
});

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
  storage: multerS3Uploader,
});

export const videoUploadMiddleWare = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: megaByte * 30,
  },
  storage: multerS3Uploader,
});
