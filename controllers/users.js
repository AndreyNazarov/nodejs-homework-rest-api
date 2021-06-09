const Users = require("../model/users");
const { HttpCode } = require("../helper/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/sender");
const UploadAvatar = require("../services/upload-avatars-cloud");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "This email is already exist",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, email, subscription, avatar, verifyToken } = newUser;
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid()
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email);
    } catch (e) {
      console.log(e.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      body: { id, email, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1w" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { token },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(204).json({});
};
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;

    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new UploadAvatar(uploadCloud);
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg
    );

    await Users.updateAvatar(id, avatarUrl, userIdImg);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};
const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token);

    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Verification was successful",
      });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (err) {
    next(err);
  }
};
const repeatSendEmailVerify = async (req, res, next) => {
  const user = Users.findByEmail(req.body.email);
  if (user) {
    const { email, verify, verifyToken } = user;
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        await emailService.sendVerifyPasswordEmail(verifyToken, email);
        return res.status(200).json({
          status: "success",
          code: 200,
          message: "Verification email resubmitted",
        });
      } catch (e) {
        console.log(e.message);
        return next(e);
      }
    }
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "This email has already been verified",
    });
  }
  return res
    .status(404)
    .json({ status: "error", code: 404, message: "User not Found" });
};
module.exports = { reg, verify, login, logout, avatars, repeatSendEmailVerify };
