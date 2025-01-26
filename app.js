import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

// Import DB Connect
import connectDB from './db/connect.js';

// Security packages (extras)
import helmet from 'helmet';
import cors from 'cors';

import { xss } from 'express-xss-sanitizer';
import rateLimiter from 'express-rate-limit';

import { auth } from './middleware/authentication.js';

// Routers
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.use(express.json());
// extra packages
app.set('trust proxy', 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(helmet());
app.use(cors());
app.use(xss);

app.get('/', (req, res) => {
  res.send('Jobs api');
});
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, '0.0.0.0', () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
