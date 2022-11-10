const createWebSocket = async (roomId: string, userId: string) => {
  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/room/${roomId}/user/${userId}`);
  return ws;
};

export default createWebSocket;
