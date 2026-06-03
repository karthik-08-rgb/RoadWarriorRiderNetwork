import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { ridersRouter } from './routes/riders';
import { scoreRouter } from './routes/score';
import { adminRouter } from './routes/admin';
dotenv.config();

const app = express();

// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL || "",
//       "http://localhost:5173"
//     ],
//     credentials: true
//   })
// );
app.use(cors());

app.use(express.json());

app.use('/api/riders', ridersRouter);
app.use('/api/score', scoreRouter);
app.use('/api/admin', adminRouter);

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Road Warrior Rider Network API Running'
  });
});

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});