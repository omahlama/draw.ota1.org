import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import createState from './src/state';
import createMongo from './src/mongo';

const state = createState(100, 100);

const PORT = process.env.PORT || 5000;

let drawCounter = 0;

async function startServer() {
  const app = express();
  app.use(express.static('static'));

  const server = http.Server(app);
  const io = socketIO(server);

  const { save, restore, logDraw } = await createMongo();
  const { pixels, events } = await restore();
  if (pixels) {
    state.setState(pixels);
  }
  if (events) {
    await events.forEach(({ x, y, color }) => {
      console.log('Restore from event log', x, y, color);
      state.setPixel(x, y, color);
    });

    console.log('Saving restored state');
    await save(state.getState());
  }

  io.on('connection', socket => {
    console.log('A user connected', socket.id);
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });

    socket.on('SET_PIXEL', ({ x, y, color }) => {
      state.setPixel(x, y, color);
      console.log('Set pixel', x, y, color);
      io.emit('UPDATE_PIXEL', { x, y, color });
      if (drawCounter > 20) {
        console.log('Save full state');
        save(state.getState());
        drawCounter = 0;
      }
      logDraw(x, y, color);
      drawCounter++;
    });
    socket.emit('FULL_STATE', state.getState());
  });
  server.listen(PORT, () => console.log(`Running on port ${PORT}!`));
}

startServer();
