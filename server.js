require('dotenv').config(); 
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('PORT from .env:', process.env.PORT);
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});