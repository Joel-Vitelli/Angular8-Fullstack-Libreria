const User = require("./../models/user");

const getAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  res.status(200).json(user);
};

const getbyEmail = async (req, res) => {
  const email = req.body.email;
  const users = await User.find({ email: email });
  res.status(200).json(users);
};

const insertUser = async (req, res) => {
  const newUser = new User(req.body);
  const user = await newUser.save();
  res.status(200).json(user);
  const io = req.app.get("io");
  io.emit("refreshUsers");
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const result = await User.findByIdAndUpdate(id, user);
  res.status(200).json({ _id: id, user: user });
  const io = req.app.get("io");
  io.emit("refreshUsers");
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await User.findByIdAndDelete(id);
  res.status(200).json(result);
  const io = req.app.get("io");
  io.emit("refreshUsers");
};

module.exports = {
  getAll,
  getOne,
  insertUser,
  updateUser,
  deleteUser,
  getbyEmail
};
