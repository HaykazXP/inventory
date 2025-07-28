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
      login: 'POST /login',
      products: {
        getAll: 'GET /products',
        getOne: 'GET /products/:id',
        create: 'POST /products',
        update: 'PUT /products/:id',
        delete: 'DELETE /products/:id'
      },
      sellingPoints: {
        getAll: 'GET /selling-points',
        getOne: 'GET /selling-points/:id',
        create: 'POST /selling-points',
        update: 'PUT /selling-points/:id',
        delete: 'DELETE /selling-points/:id'
      }
    }
  });
};

module.exports = {
  healthCheck,
  getRoot
}; 