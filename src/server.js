import express from "express";
import morgan from "morgan";
import { localsMiddleWare } from "./middleWares";
import session from "express-session";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const loggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsMiddleWare);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
