import { Message } from './types';

class WS {
  public instance: WebSocket | null;

  constructor() {
    this.instance = null;
  }

  createWebSocket(roomId: string, userId: string) {
    this.instance = new WebSocket(`${import.meta.env.VITE_WS_URL}/room/${roomId}/user/${userId}`);
  }

  closeWebSocket() {
    this.instance?.close();
  }

  sendWsMsg(
    userId: string,
    roomId: string,
    operation: string,
    data: Record<string, unknown> | null
  ) {
    const msg: Message = {
      userId,
      roomId,
      operation,
      data,
    };

    if (this.instance) {
      this.instance.send(JSON.stringify(msg));
    }
  }
}

export default WS;
