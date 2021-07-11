import Photo from "../models/Photo";
import User from "../models/User";
import Comment from "../models/Comment";

export const photoHome = async (req, res) => {
  const photos = await Photo.find({}).populate("owner");

  return res.render("photo/photo-home", { pageTitle: "Photo", photos });
};

export const getPhotoUpload = async (req, res) => {
  return res.render("photo/photo-upload", { pageTitle: "upload Photo" });
};

export const postPhotoUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files,
    body: { title, description, hashtags },
  } = req;

  const isHeroku = process.env.NODE_ENV === "production";

  const pfiles = files.map((file) => file.path);
  const hfiles = files.map((file) => file.location);
  let fileUrl = [...pfiles];
  let herokuFileUrl = [...hfiles];
  try {
    const newPhoto = await Photo.create({
      title,
      description,
      fileUrl: isHeroku ? herokuFileUrl : fileUrl,
      owner: _id,
      hashtags: Photo.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.photos.push(newPhoto._id);
    user.save();
    return res.redirect("/photos");
  } catch (err) {
    console.log(err);
    return res.status(400).render("photo/photo-upload", {
      pageTitle: "Upload Photo",
      errorMessage: err._message,
    });
  }
};

export const photoView = async (req, res) => {
  const {
    params: { id },
  } = req;

  const photo = await Photo.findById(id).populate("owner").populate("comments");
  if (!photo) {
    return res.render("404", { pageTitle: "Photo not found" });
  }

  return res.render("photo/photo-watch", { pageTitle: "Photo", photo });
};

export const getEditPhoto = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;

  const photo = await Photo.findById(id);

  if (!photo) {
    return res.status(404).render("404", { pageTitle: "Photo not found" });
  }

  if (String(photo.owner) !== String(_id)) {
    req.flash("error", "You are not the owner");
    return res.status(403).redirect("/photos");
  }

  return res.render("photo/edit-photo", {
    pageTitle: `Edit ${photo.title}`,
    photo,
  });
};

export const postEditPhoto = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  console.log(id, title, description, hashtags);
  const photo = await Photo.findById(id);

  if (!photo) {
    return res.status(404).render("404", { pageTitle: "photo not found" });
  }
  console.log(photo.owner, _id);
  if (String(photo.owner) !== String(_id)) {
    return res.status(403).redirect(`/photos/${id}`);
  }
  await Photo.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Photo.formatHashtags(hashtags),
  });
  photo.save();
  req.flash("success", "Edit Success");
  return res.redirect(`/photos/${id}`);
};

export const deletePhoto = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const photo = await Photo.findById(id).populate("User").populate("Comment");
  if (!photo) {
    return res.status(404).render("404", { pageTitle: "Video not allow" });
  }
  if (String(photo.owner) !== String(_id)) {
    return res.status(403).redirect("/photos");
  }
  await Photo.findByIdAndDelete(id);
  return res.redirect("/photos");
};

export const photoSearch = async (req, res) => {
  const { keyword } = req.query;
  let photos = [];
  if (keyword) {
    photos = await Photo.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }

  return res.render("search", { pageTitle: "Search", photos });
};

export const photoComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  console.log(id);
  console.log(text);
  const photo = await Photo.findById(id);

  if (!photo) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    photo: id,
  });
  photo.comments.push(comment._id);
  photo.save();
  return res.status(201).json({ photoCommentId: comment._id });
};

export const photoCommentDelete = async (req, res) => {
  const {
    params: { id },
  } = req;
  const comment = await Comment.findById(id).populate("Photo");
  const photo = await Photo.findById(comment.photo);

  if (String(id) !== String(comment._id)) {
    return res.sendStatus(404);
  }
  if (!comment) {
    return res.sendStatus(404);
  } else if (!photo) {
    return res.sendStatus(404);
  } else {
    photo.comments.remove(id);
    photo.save();
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(200);
  }
};

export const photoThumbsUp = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const photo = await Photo.findById(id);

  if (!photo) {
    return res.sendStatus(404);
  }

  const user = await User.findById(_id);

  if (!user) {
    return res.sendStatus(404);
  }

  const existingRating = await User.findOne({ ratingPhoto: id });

  let ratingCount;
  if (existingRating) {
    user.ratingPhoto.remove(id);
    await user.save();

    photo.meta.rating.remove(_id);
    await photo.save();
    ratingCount = photo.meta.rating.length;
    console.log(ratingCount);
    return res.status(201).json({ ratingCount });
  }

  user.ratingPhoto.push(id);
  await user.save();
  photo.meta.rating.push(_id);
  await photo.save();

  ratingCount = photo.meta.rating.length;

  console.log(ratingCount);

  return res.status(201).json({ ratingCount });
};
