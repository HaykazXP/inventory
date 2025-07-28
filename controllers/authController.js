const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Missing credentials',
      message: 'Username and password are required'
    });
  }

  const validUsername = process.env.USERNAME || 'admin';
  const validPassword = process.env.PASSWORD || 'password123';

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Username or password is incorrect'
    });
  }

  const token = jwt.sign(
    { username: username },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { expiresIn: '1d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token: token,
    expiresIn: '1d'
  });
};

module.exports = {
  login
}; 