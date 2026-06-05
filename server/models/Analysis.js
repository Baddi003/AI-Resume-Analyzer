import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
  },

  analysis: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model(
  "Analysis",
  analysisSchema
);

export default Analysis;