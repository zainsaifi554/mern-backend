import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './Routes/Auth.js';
import userRoutes from './Routes/user.js';
import cors from 'cors';
const app = express()
const port = 4000

app.use(express.json())
app.use(morgan('tiny'))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
}));
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
//   }));
  

mongoose.connect(process.env.MongoDB)
    .then(() => console.log("Mongo DB Connected!"))
    .catch((e) => console.error('MongoDB connection error:', e));

app.get('/', (req, res) => {
    res.send('Hello World! to Zain')
})

app.use('/auth', authRoutes)
app.use('/user', userRoutes)





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})