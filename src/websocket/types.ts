type Message = {
  userId: string;
  roomId: string;
  operation: string;
  data: Record<string, unknown> | null;
};

export type { Message };
