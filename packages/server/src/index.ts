import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { APP_NAME } from '@proxymity/shared';
import type { ITestMessage } from '@proxymity/shared';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" } // Permitir conexiones desde Vite (puerto 3000)
});

console.log(`Iniciando ${APP_NAME}...`);

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    const msg: ITestMessage = { text: 'Hola desde el Backend!', from: 'SERVER' };
    socket.emit('hello', msg);
});

httpServer.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
