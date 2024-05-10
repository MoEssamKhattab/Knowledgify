const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); 
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true, transform: (doc, ret) => { delete ret._id; } })) });
};

const getUsersOfCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  let users;
  try {
    users = await User.find({ enrolledCourses: courseId }, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true, transform: (doc, ret) => { delete ret._id; } })) });
};

const getUser = async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  try {
    user = await User.find({ ID: userId }, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ user: user.toObject({ getters: true, transform: (doc, ret) => { delete ret._id; } })});
};

const signup = async (req, res, next) => {
  const { bio, fullName, email, password, image } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({ email })
    console.log("jjjjjj");
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  if (existingUser) {
    res.json({ message: 'UserExist' });
  }

  const username = email.split('@')[0];
  const ID = 'SD' + username;
  console.log("jjjj==ooojj");

  const createdUser = new User({
    ID,
    bio,
    fullName,
    email,
    password,
    image
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ message: 'SignedUp' });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  } 

  res.json({ message: 'LoggedIn' });
};

exports.getUsers = getUsers;
exports.getUsersOfCourse = getUsersOfCourse;
exports.getUser = getUser; 
exports.signup = signup;
exports.login = login;