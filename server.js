import express from "express";
import http from "http";
import socketIO from "socket.io";

import createState from "./src/state";
import createMongo from "./src/mongo";

const state = createState(100, 100);

const PORT = process.env.PORT || 5000;

async function startServer() {
  const app = express();
  app.use(express.static("static"));

  const server = http.Server(app);
  const io = socketIO(server);

  const { save, restore, logDraw } = await createMongo();
  const pixels = await restore();
  if (pixels) {
    state.setState(pixels);
  }
  io.on("connection", socket => {
    console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });

    socket.on("SET_PIXEL", ({ x, y, color }) => {
      state.setPixel(x, y, color);
      console.log("Set pixel", x, y, color);
      io.emit("UPDATE_PIXEL", { x, y, color });
      logDraw(x, y, color);
      save(state.getState());
    });
    socket.emit("FULL_STATE", state.getState());
  });

  server.listen(PORT, () => console.log(`Running on port ${PORT}!`));
}

startServer();