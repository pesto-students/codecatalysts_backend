const Interview = require("../models/interview.model");
const openAiApiCall = require("./openai.controller");

const getAllInterviews = async (req, res) => {
  console.log("GET All Interviews..");
  try {
    const pageNumber = parseInt(req.query.page_number) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const skip = (pageNumber - 1) * pageSize;
    let { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalRecordsCount = await Interview.countDocuments({
        purchase_date: {
          $gte: start,
          $lte: end,
        },
        user_id: req.params.user_id,
      });
      const totalPages = Math.ceil(totalRecordsCount / pageSize);
      const interview = await Interview.find({
        purchase_date: {
          $gte: start,
          $lte: end,
        },
        user_id: req.params.user_id,
      })
        .skip(skip)
        .limit(pageSize);
      res.json({
        total_page_count: totalPages,
        current_page: pageNumber,
        interview: interview,
      });
    } else {
      const totalRecordsCount = await Interview.countDocuments({
        user_id: req.params.user_id,
      });
      const totalPages = Math.ceil(totalRecordsCount / pageSize);
      const interview = await Interview.find({ user_id: req.params.user_id })
        .skip(skip)
        .limit(pageSize);
      res.json({
        total_page_count: totalPages,
        current_page: pageNumber,
        interview: interview,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const getInterviewById = async (req, res) => {
  console.log("GET Asset BY ID", req.params.id);
  try {
    const asset = await Interview.findById(req.params.id);
    res.json(asset || {});
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const createInterview = async (req, res) => {
  try {
    console.log("Create Interview", req.body);
    var result = await openAiApiCall("Python");
    const questions_str = result.choices[0].message.content;
    const questions = JSON.parse(questions_str);
    const interviewValue = await Interview.create({
      ...req.body,
      user_id: req.params.user_id,
      questions: questions.questions,
    });
    res.json(interviewValue);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const updateInterview = async (req, res) => {
  console.log("Interview Update");
  try {
    const user = await Interview.updateOne(
      { _id: req.params.id },
      { ...req.body }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

const deleteInterview = (req, res) => {
  console.log("Interview delete");
  try {
    Interview.deleteOne({ _id: req.params.id }).then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: String(err) });
  }
};

module.exports = {
  getAllInterviews, //SELECT *
  getInterviewById, //SELECT
  createInterview, //INSERT
  updateInterview, //UPDATE
  deleteInterview, //DELETE
};
