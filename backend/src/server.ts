import { app } from './app';
import { connectDB } from './config/db';

async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
}

startServer();
