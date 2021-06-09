import User from "../models/User";
import bcrypt from "bcrypt";

// 회원가입 -------
export const getJoin = (req, res) => res.render("Join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    username,
    password1,
    password2,
    location,
  } = req.body;
  const pageTitle = "Join";
  if (password1 !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errMsg: "password is not correspond",
    });
  }
  const errExists = await User.exists({ $or: [{ email }, { username }] });
  if (errExists) {
    return res.status(400).render("join", {
      pageTitle,
      errMsg: "This username/email is already taken",
    });
  }
  try {
    await User.create({
      firstname,
      lastname,
      email,
      username,
      password: password1,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(404).render("join", {
      pageTitle,
      errMsg: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Log In" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Log In";

  const loggingUser = await User.findOne({ username });
  if (!loggingUser) {
    return res.status(400).render("login", {
      pageTitle,
      errMsg: `${username} does not exists. please check your username`,
    });
  }
  const comparePwd = await bcrypt.compare(password, loggingUser.password);
  if (!comparePwd) {
    return res.status(400).render("login", {
      pageTitle,
      errMsg: "Password is not correct",
    });
  }
  req.session.loggedIn = true;
  req.session.user = loggingUser;

  return res.redirect("/");
};

// --- user

export const logout = (req, res) => res.send("log out");

export const userProfile = (req, res) => res.send("Profile");

export const editUser = (req, res) => res.send("Edit User");

export const deleteUser = (req, res) => res.send("delete page");
