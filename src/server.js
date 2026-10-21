require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to at least 32 characters');
}

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start API:', error);
  process.exitCode = 1;
});
