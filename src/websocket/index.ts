import { nanoid } from 'nanoid/async';

const createWebSocket = async () => {
  const id = await nanoid();
  const roomId = '123456';
  // const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/${roomId}`);
  const ws = new WebSocket(`ws://localhost:8000/ws?id=${id}`);

  return ws;
};

export default createWebSocket;
