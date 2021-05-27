import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const loogerMiddleware = morgan("dev");

const home = (req, res) => {
  return res.send("i am final");
};
const login = (req, res) => {
  return res.send("i am login");
};

app.use(loogerMiddleware);

app.get("/", home);
app.get("/login", login);

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
