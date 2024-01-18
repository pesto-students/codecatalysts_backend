const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth");


//user SignUp
router.post("/api/users", userController.createUser);
//User Login
router.post("/api/user/login", userController.login);
// USER Routes
router.get("/api/users", authMiddleware, userController.getUsers); //select
router.get("/api/users/:id", authMiddleware, userController.getUserById); //select
router.post("/api/users/:id", authMiddleware, userController.updateUser); //Update
router.delete("/api/users/:id", authMiddleware, userController.deleteUser); //delete


module.exports = router;
