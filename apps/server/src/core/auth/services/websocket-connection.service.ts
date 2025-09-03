import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserService } from "../../../features/user/services/user/user.service";

/**
 * Interface representing a WebSocket connection with associated user data
 */
interface SocketConnection {
  socket: Socket;
  userId: string;
  connectedAt: Date;
}

/**
 * Service for managing authenticated WebSocket connections
 */
@Injectable()
export class WebSocketConnectionService {
  // Map of socket ID to connection details
  private connections: Map<string, SocketConnection> = new Map();

  constructor(private readonly userService: UserService) {}

  /**
   * Adds a new authenticated connection
   */
  addConnection(socket: Socket, userId: string): void {
    this.connections.set(socket.id, {
      socket,
      userId,
      connectedAt: new Date(),
    });
  }

  /**
   * Removes a connection when socket disconnects
   */
  removeConnection(socketId: string): void {
    this.connections.delete(socketId);
  }

  /**
   * Gets connection details by socket ID
   */
  getConnectionBySocketId(socketId: string): SocketConnection | undefined {
    return this.connections.get(socketId);
  }

  /**
   * Gets all connections for a specific user
   */
  getConnectionsByUserId(userId: string): SocketConnection[] {
    return Array.from(this.connections.values()).filter(
      (connection) => connection.userId === userId,
    );
  }

  /**
   * Gets all active connections
   */
  getAllConnections(): SocketConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Gets count of active connections
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Broadcasts a message to all connections of a specific user
   */
  broadcastToUser(userId: string, event: string, data: any): void {
    const userConnections = this.getConnectionsByUserId(userId);
    userConnections.forEach(({ socket }) => {
      socket.emit(event, data);
    });
  }

  /**
   * Retrieves full user details if needed (lazy loading)
   * Only call this when you need more user details than just the ID
   */
  async getUserDetails(userId: string) {
    return this.userService.find(userId);
  }
}
