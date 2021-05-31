export const trending = (req, res) => {
  const albums = [
    { title: "Hello" },
    { title: "image #1" },
    { title: "image #2" },
    { title: "image #3" },
  ];
  return res.render("home", { pageTitle: "Home", albums });
};

export const watchAlbum = (req, res) =>
  res.render("album", { pageTitle: "Album" });

export const editAlbum = (req, res) =>
  res.render("editAlbum", { pageTitle: "Edit Album" });

export const uploadAlbum = (req, res) =>
  res.render("upload", { pageTitle: "Upload Album" });

export const deleteAlbum = (req, res) =>
  res.render("deleteAlbum", { pageTitle: "Delete Album" });
