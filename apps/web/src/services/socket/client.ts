// --- Socket.io Client Setup ---
import { io, Socket } from "socket.io-client";

// autoConnect: false means you control when to connect (recommended for auth flows).
// withCredentials: true allows cookies/auth headers if needed.
const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  autoConnect: false,
  withCredentials: true,
});
export default socket;

/*
     For full list: https://socket.io/docs/v4/client-api/#new-Manager-url-options better read this shit , useful AF

    //   The path to connect to the server.
    // path: "/socket.io",

    // transports: string[] (default: ["polling", "websocket"])
    //   The transport mechanisms to use.
    // transports: ["websocket"],

    // reconnection: boolean (default: true)
    //   Whether to reconnect automatically.
    // reconnection: true,

    // reconnectionAttempts: number (default: Infinity)
    //   Maximum number of reconnection attempts.
    // reconnectionAttempts: 5,

    // reconnectionDelay: number (default: 1000)
    //   How long to initially wait before attempting a new reconnection (ms).
    // reconnectionDelay: 2000,

    // timeout: number (default: 20000)
    //   Connection timeout before an error is emitted (ms).
    // timeout: 10000,

    // extraHeaders: object
    //   Additional headers to send with requests (useful for auth).
    // extraHeaders: {
    //   Authorization: "Bearer <token>"
    // },

    // multiplex: boolean (default: true)
    //   Whether to reuse existing connections.
    // multiplex: false,

    // auth: object|function
    //   Authentication payload or function returning it.
    // auth: {
    //   token: "your-auth-token"
    // },


    for @AL-ABYADH
      the difference between using extraHeaders and auth for bearer token is 

          - `extraHeaders` sends custom HTTP headers (like Authorization: Bearer <token>) with the initial HTTP handshake request. for (Node.js or anything else), because browsers block setting custom headers for WebSocket connections due to security restrictions.
          - `auth` is the recommended way for authentication in browser clients. The object you provide (e.g., { token: "your-auth-token" }) is sent as part of the Socket.io protocol during the handshake, not as an HTTP header, so it works in browsers and Node.js.
          
        
  
/*


/**
 * --- Usage Example ---
 *  //if u came from the ReadMe i'm not using the hook here 
 *  // if u don't then never mind this comment 
 *
 * import socket from '@/services/socket/client';
 *
 * // Connect to the server
 * socket.connect(); // u should connect once preferable put it in this file but if u have credentials then you will figure it out when the times comes
 *
 * // Listen for an event
 * socket.on('message', (data) => {
 *   console.log('Received message:', data);
 * });
 *    
 *
 * // Emit an event
 * socket.emit('message', { text: 'Hello, server!' });
 * 
 * 
 *   But why do we have events.ts ??
 *       so instead of 'message' we use the global events object
 *      - socket.on(SOCKET_EVENTS.MESSAGE, (data) => { // do something with data });
 *      - socket.emit(SOCKET_EVENTS.MESSAGE, { text: 'Hello, server!' });
 *
 * // Disconnect when done
 * socket.disconnect();
 * 
 * @author @Ebo-on-weeds
 */
