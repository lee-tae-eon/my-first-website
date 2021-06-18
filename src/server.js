import express from "express";
import { localsMiddleWare, loggerMiddleWare } from "./middleWares";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

let milliseconds = 1000;
let millisecToMinute = 60000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(loggerMiddleWare);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: millisecToMinute * 30,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);
app.use(localsMiddleWare);

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
