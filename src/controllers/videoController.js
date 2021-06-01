export const trending = (req, res) => {
  const videos = [
    {
      title: "no.1 album",
      rating: 5,
      comments: 2,
      createAt: "2minute",
      views: 50,
      id: 1,
    },
    {
      title: "no.2 album",
      rating: 5,
      comments: 2,
      createAt: "2minute",
      views: 50,
      id: 1,
    },
    {
      title: "no.3 album",
      rating: 5,
      comments: 2,
      createAt: "2minute",
      views: 50,
      id: 1,
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = (req, res) =>
  res.render("video", { pageTitle: "Video" });

export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });

export const uploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload Video" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
