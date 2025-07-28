const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};

const getRoot = (req, res) => {
  res.json({
    message: 'Welcome to the Inventory API',
    version: '1.0.0',
    endpoints: {
      health: '/',
      login: 'POST /login'
    }
  });
};

module.exports = {
  healthCheck,
  getRoot
}; 