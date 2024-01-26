const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionsSchema = new Schema({
    a: String,
    b: String,
    c: String,
    d: String
});

const QuestionsSchema = new Schema({
  question: String,
  answer: String,
  options:optionsSchema
});

const InterviewSchema = new Schema({
  number: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
  },
  questions:[QuestionsSchema],
  created_on: {
    type: Date,
    default: Date.now
  },
  correct_answer_count: {
    type: Number,
    default: 0
  },
  start_datetime: {
    type: Date,
  },
  end_datetime: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
