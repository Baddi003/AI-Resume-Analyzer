import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Analysis from "../models/Analysis.js";


dotenv.config();

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {

    const { resumeText, jobDescription } = req.body;

    const prompt = `
Analyze this resume for the given job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Give:
1. Match Score
2. Missing Skills
3. Resume Improvements
4. Interview Questions
`;

const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openai/gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
  }

);
    console.log(response.data);
    const result =
  response.data.choices[0].message.content;

if (!result) {
  return res.status(500).json({
    error: "No response from Gemini AI",
  });
}
    await Analysis.create({
      jobDescription,
      analysis: result,
    });

    res.json({
      analysis: result,
    });

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "AI Analysis Failed",
    });
  }
});
router.get("/history", async (req, res) => {
  try {

    const analyses = await Analysis.find()
      .sort({ createdAt: -1 });

    res.json(analyses);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed To Fetch History",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Analysis Deleted",
    });

  } catch (error) {

    console.log("===== ERROR START =====");
  
    if (error.response) {
      console.log("Status:", error.response.status);
  
      console.log(
        "Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.log(error.message);
    }
  
    console.log("===== ERROR END =====");
  
    res.status(500).json({
      error: "AI Analysis Failed",
    });
  }
});
export default router;