const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route example
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}! You have accessed a protected route.` });
});

module.exports = router;
