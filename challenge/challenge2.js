import express from "express";

const app = express();

const PORT = 4000;

const urlLogger = (req, res, next) => {
  console.log(`Path: ${req.url}`);
  next();
};
const timeLogger = (req, res, next) => {
  const date = new Date();
  console.log(`Time: ${date.toLocaleString().split(". 오후")[0]}`);
  next();
};

const securityLogger = (req, res, next) => {
  const protocol = req.protocol;
  if (protocol === "http") {
    console.log("secure ✅");
  } else {
    console.log("Insecure ❌");
  }
  next();
};

app.use(urlLogger);
app.use(timeLogger);
app.use(securityLogger);

app.get("/", (req, res) => res.send("<h1>Home</h1>"));
app.get("/protected", (req, res) => res.send("<h1>Protected</h1>"));

// Codesandbox gives us a PORT :)
app.listen(PORT, () => `Listening!✅`);
