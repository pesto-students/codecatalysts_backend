const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  console.log("GET USERS");
  try {
    const pageNumber = parseInt(req.query.page_number) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalRecordsCount = await User.countDocuments();
    const totalPages = Math.ceil(totalRecordsCount / pageSize);
    const user = await User.find().skip(skip).limit(pageSize);
    res.json({
      total_page_count: totalPages,
      current_page: pageNumber,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const getUserById = async (req, res) => {
  console.log("GET USER BY ID");
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const createUser = async (req, res) => {
  console.log("USER SignUp");
  try {
    console.log("Register new user", req.body);
    const users = await User.findOne({ email: req.body.email });
    if (users) {
      res.status(400).send({ error: "User Already Exist" })
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const login = async (req, res) => {
  console.log("User login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log(user);
        let token = jwt.sign(
          { id: req.body.id, email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.cookie("access_token", token, { maxAge: 60000 * 60 * 24 });
        res.json({
          user: {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            skills: user.skills || [],
            image_string: user.image_string
          },
          access_token: token,
        });
      } else {
        res.status(400).send({ error: "Incorrect password" });
      }
    } else {
      res.status(400).send({ error: "User does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const updateUser = async (req, res) => {
  console.log("User Update", req.params.id);
  let allowedUpdates = ["firstname", "lastname", "email", "skills", "image_string"];
  let updating = Object.keys(req.body);
  let isUpdateAllowed = updating.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isUpdateAllowed) return res.status(400).send({ error: "invalid updates!" } );
  try {
    const user = await User.updateOne({ _id: req.params.id }, req.body);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const changeUserPassword = async (req, res) => {
  const {id} = req.params
  const { currentPassword, newPassword, confirmPassword } = req.body
  
  if (newPassword !== confirmPassword) {
    return res.status(400).send({ error: "Confirm password doesn't match New password" });
  }
  try {
    const user = await User.findOne({ _id: id });
    if (user) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (isMatch) {
        const password = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.updateOne({ _id: id }, { password });
        res.json(updatedUser);
      } else {
        res.status(400).send({ error: "Please check your current password" });
      }
    } else {
      res.status(400).send({ error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
}

const deleteUser = (req, res) => {
  console.log("User delete");
  try {
    User.deleteOne({ _id: req.params.id }).then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  changeUserPassword,
  deleteUser,
};
