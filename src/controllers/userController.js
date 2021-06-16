import fetch from "node-fetch";
import User from "../models/User";
import bcrypt from "bcrypt";
const fs = require("fs");

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

  const loggingUser = await User.findOne({ username, socialLogin: false });
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
      // set notification
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialLogin: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
// --- user

export const getEditUser = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEditUser = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log("file : ", file);
  console.log("ava  : ", avatarUrl);
  const existUsername = await User.findOne({ username });
  const existEmail = await User.findOne({ email });

  if (
    (existUsername && existUsername._id.toString() !== _id) ||
    (existEmail && existEmail._id.toString() !== _id)
  ) {
    return res.status(400).render("users/edit-profile", {
      pageTitle: "Edit Profile",
      errMsg: "This username or email is aleady taken",
    });
  }
  let updatedUser;

  // const updatedUser = await User.findByIdAndUpdate(
  //   _id,
  //   {
  //     avatarUrl: file
  //       ? avatarUrl
  //         ? await fs.unlink(String(avatarUrl), (err, file) => {
  //             if (err) {
  //               console.log(err);
  //             } else {
  //               return file.path;
  //             }
  //           })
  //         : file.path
  //       : avatarUrl,
  //     name,
  //     email,
  //     username,
  //     location,
  //   },
  //   { new: true }
  // );

  if (!file) {
    updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: avatarUrl,
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
  } else {
    await fs.unlink(String(avatarUrl), (err) => {
      if (err) {
        return console.log(err);
      }
    });
    updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file.path,
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
  }

  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePwd = (req, res) => {
  const {
    session: {
      user: { socialLogin },
    },
  } = req;
  if (socialLogin) {
    return res.redirect("/");
  }

  return res.render("users/change-pwd", { pageTitle: "Change Password" });
};

export const postChangePwd = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id, password },
    },
    body: { currPwd, newPwd, newPwdConfirm },
  } = req;
  const comparePwd = await bcrypt.compare(currPwd, password);

  if (!comparePwd) {
    return res.status(400).render("users/change-pwd", {
      pageTitle,
      errMsg: "The current password is incorrect",
    });
  }

  if (newPwd !== newPwdConfirm) {
    return res.status(400).render("users/change-pwd", {
      pageTitle,
      errMsg: "The password does not match",
    });
  }
  const user = await User.findById(_id);
  user.password = newPwd;
  await user.save();
  req.session.user.password = user.password;

  return res.redirect("/");
};

export const deleteUser = (req, res) => res.send("delete page");
