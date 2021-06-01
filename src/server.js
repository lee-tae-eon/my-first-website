import express from "express";
import morgan from "morgan";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const loogerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(loogerMiddleware);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
