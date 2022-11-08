import createWebSocket from '.';
import { nanoid } from 'nanoid/async';

const ws = await createWebSocket();

ws.addEventListener('open', async () => {
  // console.log('message: 已与 server 成功建立连接');

  const id = await nanoid();
  ws.send(JSON.stringify({ id, type: 'join' }));
});

ws.addEventListener('close', () => {
  // console.log('error: 与 server 的连接已断开');
});

export default ws;
