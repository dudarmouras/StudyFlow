import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  }
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(router);

io.on('connection', (socket) => {
  console.log('🔌 conectado:', socket.id)

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    console.log(`✅ entrou na sala ${roomId}`)
  })

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId)
  })

  socket.on('disconnect', () => {
    console.log('❌ desconectado:', socket.id)
  })

    socket.on('timer-start', (roomId: string) => {
    socket.to(roomId).emit('timer-start')
  })

  socket.on('timer-pause', (roomId: string) => {
    socket.to(roomId).emit('timer-pause')
  })

  socket.on('timer-reset', ({ roomId, mode }: { roomId: string, mode: string }) => {
    socket.to(roomId).emit('timer-reset', mode)
  })

  socket.on('timer-mode', ({ roomId, mode }: { roomId: string, mode: string }) => {
    socket.to(roomId).emit('timer-mode', mode)
  })
})

export { io }

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});