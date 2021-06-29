import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
const fs = require("fs");

// Video.find({}, (error, videos) => {});
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");

  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  const videos = await Video.find({
    title: {
      $regex: new RegExp(video.title, "i"),
    },
    _id: { $ne: id },
  }).populate("owner");

  if (!videos) {
    return res.send("no video");
  }
  return res.render("videos/watchVideo", {
    pageTitle: video.title,
    video,
    videos,
  });
};

export const getEditVideo = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner");
    return res.status(403).redirect("/");
  }
  return res.render("videos/editVideo", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Edit Success!");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "upload video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files: { videoFile, thumbFile },
    body: { title, description, hashtags },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: videoFile[0].path,
      thumbUrl: thumbFile[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const filePath = await Video.findOne(
    { _id: id },
    { _id: false, fileUrl: true }
  );
  const video = await Video.findById(id).populate("User");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not allow" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
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
    }).populate("owner");
  }
  // 태언 서치코드 완료후 이코드로
  // const videos = await Video.find({
  //   $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { description: { $regex: new RegExp(keyword, "i") } }],
  // });

  return res.render("videos/search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  console.log(id);
  const comment = await Comment.findById(id).populate("Video");
  const video = await Video.findById(comment.video);

  if (String(id) !== String(comment._id)) {
    return res.sendStatus(404);
  }

  if (!comment) {
    return res.sendStatus(404);
  } else if (!video) {
    return res.sendStatus(404);
  } else {
    video.comments.remove(id);
    video.save();
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(200);
  }
};
