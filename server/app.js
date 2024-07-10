import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectionToDB from './config/dbConnection.js';
import userRouter from './routes/user.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors()); // This is for all URLs. Use the below line for specific URLs in production
// app.use(cors({
//     origin: [process.env.FRONTEND_URL],
//     credentials: true
// }));

connectionToDB();

app.use('/ping', (req, res) => {
  res.send('Pong');
});
app.use('/api/auth/', userRouter);

app.use(morgan('dev'));
app.all('*', (req, res) => {
  res.status(404).send("Oops! Error 404 page not found");
});

app.use(errorMiddleware);

export default app;
