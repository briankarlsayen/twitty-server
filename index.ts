import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import routes from './src/routes';
import { errorHandler } from './middlewares/errorHandler';
import { connectDB } from './config/config';

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
// console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
connectDB();

// * routes
app.get('/', async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Alive alive',
  });
});
app.use('/api', routes);

// * error hander middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
