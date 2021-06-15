import Video from "../models/Video";
const fs = require("fs");

// Video.find({}, (error, videos) => {});
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });

  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("watchVideo", {
    pageTitle: video.title,
    video,
  });
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  const pageUrl = req.originalUrl;
  return res.render("upload", { pageTitle: "upload video", pageUrl });
};

export const postUpload = async (req, res) => {
  const {
    file: { path: fileUrl },
    body: { title, description, hashtags },
  } = req;

  try {
    await Video.create({
      title,
      description,
      fileUrl,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const filePath = await Video.findOne(
    { _id: id },
    { _id: false, fileUrl: true }
  );

  await Video.findByIdAndDelete(id);
  await fs.unlink(filePath.fileUrl, (err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  // 태언 서치코드 완료후 이코드로
  // const videos = await Video.find({
  //   $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { description: { $regex: new RegExp(keyword, "i") } }],
  // });

  return res.render("search", { pageTitle: "Search", videos });
};
