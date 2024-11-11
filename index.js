import express from 'express';
import { authRouter } from './routes/auth.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/healthcheck', (req, res) => {
    res.json({status: '✨🌈🦄'})
})

app.use('/api/v1', authRouter)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
