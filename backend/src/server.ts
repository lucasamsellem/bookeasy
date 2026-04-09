import express from 'express';
import { connectDB } from './config/db';

async function startServer() {
  try {
    await connectDB();

    const app = express();
    app.get('/', (req, res) => res.send('Server is running'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
}

startServer();
