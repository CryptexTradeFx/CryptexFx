const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin (only once)
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await User.findOne({ username });
        if(existing) return res.status(400).json({ message: "User exists" });

        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hash, role: "admin" });
        await newUser.save();
        res.status(201).json({ message: "Admin registered" });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Login (admin or user)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, role: user.role });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
