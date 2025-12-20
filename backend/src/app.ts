import express from 'express';
import cors from 'cors';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(200).json({ status: "let's get healthy!!" });
});
