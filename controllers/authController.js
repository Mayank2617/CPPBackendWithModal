const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { firstName, middleName, lastName, phone, email, profession, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            middleName,
            lastName,
            phone,
            email,
            profession,
            password: hashedPassword
        });

        // Save user to DB
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.phone) {
                return res.status(400).json({ message: "Phone number already registered" });
            }
            if (error.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        res.status(500).json({ message: "Server error", error });
    }
};

// Handle login logic (as part of the controller)
const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { userId: user._id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful!", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { register,loginUser  };
