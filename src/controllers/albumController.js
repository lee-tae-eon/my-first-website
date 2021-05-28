export const trending = (req, res) => res.send("Home page albums");

export const uploadAlbum = (req, res) => res.send("upload album");

export const deleteAlbum = (req, res) => res.send("delete Album");

export const watchAlbum = (req, res) => {
  console.log(req.params);
  return res.send("Watch Album");
};

export const editAlbum = (req, res) => res.send("Edit album");
