import fetch from "node-fetch";
import User from "../models/User";
import bcrypt from "bcrypt";

// 회원가입 -------
export const getJoin = (req, res) => res.render("Join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, email, username, password1, password2, location } = req.body;
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
      name,
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

export const loginGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GHCLI_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithub = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GHCLI_ID,
    client_secret: process.env.GHCLI_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenReq = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenReq) {
    const { access_token } = tokenReq;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      try {
        const user = await User.create({
          name: userData.name,
          username: userData.login,
          email: emailObj.email,
          password: "",
          socialLogin: true,
          location: userData.location,
        });
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  return res.redirect("/");
};
// --- user

export const userProfile = (req, res) => res.send("Profile");

export const editUser = (req, res) => res.send("Edit User");

export const deleteUser = (req, res) => res.send("delete page");
