import express from "express";
import morgan from "morgan";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";
import albumRouter from "./routers/albumRouter";

const PORT = 4000;

const app = express();
const loogerMiddleware = morgan("dev");

app.use(loogerMiddleware);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/albums", albumRouter);

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
