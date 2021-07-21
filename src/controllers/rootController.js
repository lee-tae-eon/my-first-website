import Photo from "../models/Photo";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).populate("owner");
  const photos = await Photo.find({}).populate("owner");

  return res.render("homepage", { pageTitle: "HOME", videos, photos });
};
