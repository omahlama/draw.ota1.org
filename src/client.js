import io from "socket.io-client";
import createState from './state';

const createClient = onStateChange => {
  const state = createState(100, 100);
  
  const socket = io();
  
  socket.on("connect", () => {
    console.log("connected");
  });
  
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  
  socket.on('FULL_STATE', (data) => {
    state.setState(data);
    onStateChange(data);
    console.log(data);
  });
  
  socket.on('UPDATE_PIXEL', ({ x, y, color }) => {
    state.setPixel(x, y, color);
    onStateChange(state.getState());
  })

  return {
    setPixel: (x, y, color) => {
      socket.emit('SET_PIXEL', { x, y, color });
    }
  }
}

export default createClient;
