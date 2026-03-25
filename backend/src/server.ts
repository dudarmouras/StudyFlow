import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes'; 

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
