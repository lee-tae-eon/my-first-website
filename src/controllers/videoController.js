import Video from "../models/Video";

// Video.find({}, (error, videos) => {});
export const home = async (req, res) => {
  const videos = await Video.find({});

  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = (req, res) => {
  const { id } = req.params;
  return res.render("watchVideo", {
    pageTitle: "Video",
  });
};

export const getEditVideo = (req, res) => {
  const { id } = req.params;
  return res.render("editVideo", { pageTitle: `Edit` });
};

export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  const pageUrl = req.originalUrl;
  return res.render("upload", { pageTitle: "upload video", pageUrl });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (err) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: err._message,
    });
  }
};
