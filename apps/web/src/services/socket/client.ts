// Socket.io client setup
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
