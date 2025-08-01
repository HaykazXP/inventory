const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        // Check if login and password are provided
        if (!login || !password) {
            return res.status(400).json({ msg: 'Please provide login and password' });
        }

        const adminLogin = process.env.ADMIN_LOGIN;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // In a real app, you would look up the user in the database
        // and compare a hashed password. For this simple case, we compare with env vars.
        if (login !== adminLogin || password !== adminPassword) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: 'admin' // A static id for the admin user
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) {
                    console.error('JWT Error:', err);
                    throw err;
                }
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
