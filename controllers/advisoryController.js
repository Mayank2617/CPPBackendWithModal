const { spawn } = require("child_process");
const path = require("path");

const runModelPrediction = (req, res) => {
  const { state, soil, month } = req.body;


  const pythonPath = path.join(__dirname,'..', 'crop_advisory.py');
  console.log("🚀 Running script at:", pythonPath);

  const pythonProcess = spawn("python3", [pythonPath, state, soil, month]);
  
  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: error || "Python script failed" });
    }

    try {
      const jsonResult = JSON.parse(result);
      res.json(jsonResult);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse Python output", raw: result });
    }
  });
};

module.exports = { runModelPrediction };
