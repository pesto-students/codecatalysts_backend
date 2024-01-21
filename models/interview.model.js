const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
  question: String,
  right_answer: String,
  options: {
    a: String,
    b: String,
    c: String,
    d: String
  }
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
  Questions:[QuestionsSchema],
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
