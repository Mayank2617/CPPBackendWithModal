const { spawn } = require('child_process');
const path = require('path');

exports.runModelPrediction = (req, res) => {
  const inputData = JSON.stringify(req.body);
  const scriptPath = path.join(__dirname,'..','final_priceprediction.py');

  const pythonProcess = spawn('python3', [scriptPath, inputData]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script error:', error); // 🔥 LOGGING ERROR
      return res.status(500).json({ error: 'Prediction failed', details: error });
    }

    try {
      const parsed = JSON.parse(result); // if your script returns JSON
      res.json(parsed);
    } catch (e) {
      console.error('Failed to parse model output:', result);
      res.status(500).json({ error: 'Invalid model output', raw: result });
    }
  });
};
