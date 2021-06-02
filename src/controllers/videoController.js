let videos = [
  {
    title: "no.1 album",
    rating: 5,
    comments: 2,
    createAt: "2minute",
    views: 1,
    id: 1,
  },
  {
    title: "no.2 album",
    rating: 5,
    comments: 2,
    createAt: "2minute",
    views: 50,
    id: 2,
  },
  {
    title: "no.3 album",
    rating: 5,
    comments: 2,
    createAt: "2minute",
    views: 50,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watchVideo", {
    pageTitle: `Watching ${video.title}`,
    video,
  });
};

export const getEditVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  const pageUrl = req.originalUrl;
  return res.render("upload", { pageTitle: "upload video", pageUrl });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createAt: "1second ago",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
