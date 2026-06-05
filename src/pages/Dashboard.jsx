import { useState, useEffect } from "react";
import axios from "axios";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [jobDescription, setJobDescription] = useState("");

  const [analysis, setAnalysis] = useState("");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [matchScore, setMatchScore] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ai/history"
      );
  
      setHistory(res.data);
  
    } catch (error) {
      console.log(error);
    }
  };

    const deleteAnalysis = async (id) => {
      
      try {
        await axios.delete(
          `http://localhost:5000/api/ai/${id}`
        );
    
        fetchHistory();
    
      } catch (error) {
        console.log(error);
      }
    };
  const handleAnalyze = async () => {

    try {

      setLoading(true);

      // Upload Resume
      const formData = new FormData();

      formData.append("resume", resume);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData
      );
      
      const resumeText = uploadRes.data.text;
      console.log("Resume Text:", resumeText);
      console.log(uploadRes.data);
      console.log(resumeText);

      // Send Data To Gemini AI
      console.log({
        resumeText,
        jobDescription,
      });
      const aiRes = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        {
          resumeText,
          jobDescription,
        }
      );
      const analysisText = aiRes.data.analysis;

      setAnalysis(aiRes.data.analysis);

      const scoreMatch =
       aiRes.data.analysis.match(/(\d{1,3})%/);

      if (scoreMatch) {
        setMatchScore(
          parseInt(scoreMatch[1])
       );
    }

      fetchHistory();

      setLoading(false);

    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("Analysis Failed");
    }
  };

  return (
    <div className={
      darkMode
        ? "container dark"
        : "container light"
    }
      >
      <h1 className="title">
        AI Resume Analyzer
      </h1>

      <button
        className="theme-btn"
        onClick={() =>
        setDarkMode(!darkMode)
      }
    >
      {darkMode
       ? "Light Mode"
       : "Dark Mode"}
    </button>

      <input
        className="upload-input"
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <br /><br />

      <textarea
        className="textarea"
        rows="10"
        cols="50"
        placeholder="Enter Job Description"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />

      <br /><br />
      

      <button
        className="button"
       onClick={handleAnalyze}
       disabled={loading}
   >
      {loading
        ? "Analyzing Resume..."
        : "Analyze Resume"}
     </button>
      <br /><br />

      <h2>Match Score: {matchScore}%</h2>

      <div className="progress-bar">
       <div
        className="progress-fill"
         style={{
          width: `${matchScore}%`,
      }}
    ></div>
   </div>

      <h2>Analysis Result</h2>

      <div className="analysis-box">
        <pre>{analysis}</pre>
      </div>
      <h2>Previous Analyses</h2>

     {history.map((item, index) => (
     <div
    key={index}
    className="analysis-box"
  >
    <h4>Job Description:</h4>

    <p>{item.jobDescription}</p>

    <h4>Analysis:</h4>

    <pre>{item.analysis}</pre>

    <button
      className="delete-btn"
     onClick={() =>
      deleteAnalysis(item._id)
  }
>
  Delete
</button>

   </div>
   ))}

    </div>
  );
}

export default Dashboard;