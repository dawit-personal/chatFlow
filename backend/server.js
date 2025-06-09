const app = require('./src/app');

const PORT = process.env.BACKEND_PORT || 4000;


app.listen(PORT, () => {
  console.log('PORT from .env:', process.env.BACKEND_PORT);
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});