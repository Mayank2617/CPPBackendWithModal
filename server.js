require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const predictRoutes = require('./routes/predictRoute');
const advisoryRoutes = require('./routes/advisoryRoutes');
const { exec } = require('child_process');


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to accept JSON data


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/advisory', advisoryRoutes);



app.get("/", (req, res) => {
    res.send("Backend is running...");
    exec('python3 --version', (error, stdout, stderr) => {
        if (error) {
          console.error('Python not found:', error);
        } else {
          console.log('Python version:', stdout);
        }
      });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
