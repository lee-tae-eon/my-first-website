import express from "express";

const app = express();

const PORT = 4000;

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(`${req.protocol}`);
  next();
};

const handleHome = (req, res) => {
  return res.send("i am final");
};

app.use(logger);

app.get("/", handleHome);

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
