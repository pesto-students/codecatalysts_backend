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
      return res.json({
        msg: "User Already Exist",
      });
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
        res.json({
          user: {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          access_token: jwt.sign(
            { id: req.body.id, email },
            process.env.JWT_SECRET,
            {expiresIn:60}
          ),
        });
      } else {
        res.json("password does not match");
      }
    } else {
      res.json("User does not exist");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const updateUser = async (req, res) => {
  console.log("User Update", req.params.id);
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { firstname: req.body.firstname, lastname: req.body.lastname }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

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
  deleteUser,
};
