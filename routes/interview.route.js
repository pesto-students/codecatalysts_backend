const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/interview.controller");

const authMiddleware = require("../middleware/auth");


// Interview Routes
router.get("/api/intreview/user/:user_id", authMiddleware, interviewController.getAllInterviews);  //select
router.get("/api/interview/:id", authMiddleware, interviewController.getInterviewById); //select
router.post("/api/interview/:user_id", authMiddleware, interviewController.createInterview); //insert
router.put("/api/interview/:id", authMiddleware, interviewController.updateInterview); //update
router.delete("/api/interview/:id", authMiddleware, interviewController.deleteInterview); //delete
router.post("/api/interview/:id/submit", authMiddleware, interviewController.submitInterview); //delete

module.exports = router;
