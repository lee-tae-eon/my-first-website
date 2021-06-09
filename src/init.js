import "./db";
import User from "./models/User";
import Video from "./models/Video";
import app from "./server";

const PORT = 4000;

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
