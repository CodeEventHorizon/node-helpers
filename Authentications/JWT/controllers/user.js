import User from "../models/user.js";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";

import {
  NAME_REQUIRED,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  PASSWORD_REQUIRED,
  PASSWORD_TOO_SHORT,
  WEAK_PASSWORD,
  INSECURE_PASSWORD,
  PASSWORD_INVALID,
  EMAIL_ALREADY_TAKEN,
  FAILED_REGISTRATION,
  PASSWORD_INVALID,
  REGISTER_SUCCESS,
  TOKEN_REQUIRED,
  USER_NOT_FOUND,
  INVALID_TOKEN,
} from "../constants/constants.js";
import {
  hashPassword,
  compareThePassword,
  validEmail,
  validPassword,
  isPasswordInBlacklist,
  isPasswordWeak,
} from "../helpers/user.js";

// @route   POST api/register
// @desc    User Register API
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // sanitize inputs
  const sanitizedName = sanitizeHtml(name, { allowedTags: [] });
  const sanitizedEmail = sanitizeHtml(email, { allowedTags: [] });

  if (!name) {
    return res.status(400).json({ success: false, error: NAME_REQUIRED });
  }
  if (!email) {
    return res.status(400).json({ success: false, error: EMAIL_REQUIRED });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ success: false, error: INVALID_EMAIL });
  }
  if (!password) {
    return res.status(400).json({ success: false, error: PASSWORD_REQUIRED });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: PASSWORD_TOO_SHORT,
    });
  }
  if (!validPassword(password)) {
    return res.status(400).json({
      success: false,
      error: PASSWORD_INVALID,
    });
  }
  if (isPasswordInBlacklist(password)) {
    return res.status(400).json({ success: false, error: INSECURE_PASSWORD });
  }
  if (isPasswordWeak(password)) {
    return res.status(400).json({
      success: false,
      error: WEAK_PASSWORD,
    });
  }

  try {
    // check if the email is already taken
    const exist = await User.findOne({ email: sanitizedEmail });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, error: EMAIL_ALREADY_TAKEN });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    // create new user
    const user = new User({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).json({ success: true, message: REGISTER_SUCCESS });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: FAILED_REGISTRATION,
    });
  }
};

// @route   POST api/login
// @desc    User Login API
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // input validation
    if (!validEmail(email)) {
      return res.status(400).json({ success: false, error: INVALID_EMAIL });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: PASSWORD_TOO_SHORT,
      });
    }

    // sanitize inputs
    const sanitizedEmail = sanitizeHtml(email, { allowedTags: [] });
    const sanitizedPassword = sanitizeHtml(password, { allowedTags: [] });

    // check if Database has user with that email
    const user = await User.findOne({ sanitizedEmail });
    if (!user) {
      return res.json({
        success: false,
        error: "No user found!",
      });
    }
    // check if password matches
    const match = await compareThePassword(sanitizedPassword, user.password);
    if (!match) {
      return res.json({
        success: false,
        error: "Incorrect Password",
      });
    }
    // Create signed JWT Token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION, // 7d
    });
    user.password = undefined;
    res.json({
      token,
      user,
      message: "User logged in successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: "Error. Try Again!",
    });
  }
};

// @route   POST api/verify
// @desc    User Verify Token API
// @access  Private
export const verifyToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: TOKEN_REQUIRED });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, error: USER_NOT_FOUND });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, error: INVALID_TOKEN, message: error });
  }
};
