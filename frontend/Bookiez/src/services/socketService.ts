import { io, Socket } from 'socket.io-client';
import type { Message } from '../types/exchange';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        userId,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('🔌 Socket error:', error);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.socket?.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  joinExchangeRoom(exchangeId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_exchange', exchangeId);
      console.log(`📝 Joined exchange room: ${exchangeId}`);
    }
  }

  leaveExchangeRoom(exchangeId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_exchange', exchangeId);
      console.log(`📝 Left exchange room: ${exchangeId}`);
    }
  }

  sendMessage(exchangeId: string, message: string, sender: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', {
        exchangeId,
        message,
        sender,
        timestamp: new Date().toISOString(),
      });
    }
  }

  onNewMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  offNewMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.off('receive_message', callback);
    }
  }

  onExchangeUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('exchange_update', callback);
    }
  }

  offExchangeUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('exchange_update', callback);
    }
  }

  onNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  offNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.off('notification', callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
