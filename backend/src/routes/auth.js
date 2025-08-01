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

        // Generate access token (shorter expiry)
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Access token expires in 15 minutes
        );

        // Generate refresh token (longer expiry)
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Refresh token expires in 7 days
        );

        res.json({ 
            token: accessToken,
            refreshToken: refreshToken,
            expiresIn: 15 * 60 * 1000 // 15 minutes in milliseconds
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token required' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        const payload = {
            user: {
                id: decoded.user.id
            }
        };

        // Generate new access token
        const newAccessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ 
            token: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 15 * 60 * 1000 // 15 minutes in milliseconds
        });

    } catch (err) {
        console.error('Refresh token error:', err.message);
        res.status(401).json({ msg: 'Invalid refresh token' });
    }
});

module.exports = router;
