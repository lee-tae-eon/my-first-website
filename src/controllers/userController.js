import fetch from "node-fetch";
import User from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/Video";
import axios from "axios";
import qs from "qs";

const isHeroku = process.env.NODE_ENV === "production";

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
    req.flash("success", "Join Success");
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

// 카카오 로그인

export const loginKakao = (req, res) => {
  const redirect_uri = "http://localhost:4000/users/kakao/callback";
  const heroku_redirect_uri =
    "http://gyumtube.herokuapp.com/users/kakao/finish";
  const kakaoAuthUrl = isHeroku
    ? `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_ID}&redirect_uri=${heroku_redirect_uri}&scope=profile_nickname,profile_image,account_email`
    : `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_ID}&redirect_uri=${redirect_uri}&scope=profile_nickname,profile_image,account_email`;
  return res.redirect(kakaoAuthUrl);
};

export const finishKakao = async (req, res) => {
  const redirect_uri = "http://localhost:4000/users/kakao/callback";
  const heroku_redirect_uri =
    "http://gyumtube.herokuapp.com/users/kakao/finish";
  let token;
  try {
    token = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_ID,
        client_secret: process.env.KAKAO_SECRET,
        redirectUri: isHeroku ? heroku_redirect_uri : redirect_uri,
        code: req.query.code,
      }),
    });
  } catch (err) {
    console.log("redirect err : ", err);
    return res.status(404).redirect("/login");
  }

  try {
    // console.log("token : ", token);
    const tokenUser = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
    const {
      profile: { nickname, profile_image_url },
      email,
    } = tokenUser.data.kakao_account;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        avatarUrl: profile_image_url,
        name: nickname,
        username: nickname,
        email,
        password: "",
        socialLogin: true,
        location: "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } catch (err) {
    console.log("user's data get err :", err);
    return res.status(404).redirect("/login");
  }
};

// 깃헙 로그인
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
  console.log(file);
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
  const isHeroku = process.env.NODE_ENV === "production";

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );

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
    req.flash("error", "Can't change password");
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
  // req.session.user.password = user.password;
  req.flash("info", "Password Updated");
  return res.redirect("/");
};

export const userProfile = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const user = await User.findById(id).populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    });

    if (!user) {
      return res
        .status(404)
        .render("404", { pageTitle: "유저 정보가 없습니다." });
    }

    res.render("users/user-profile", {
      pageTitle: `${user.name}의 프로필`,
      user,
    });
  } catch (error) {
    console.log("err : ", error);
    return res.redirect("/");
  }
};
