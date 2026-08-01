import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';
import type { Message } from '../types/exchange';

interface SocketContextType {
  socket: any;
  isConnected: boolean;
  joinExchangeRoom: (exchangeId: string) => void;
  leaveExchangeRoom: (exchangeId: string) => void;
  sendMessage: (exchangeId: string, message: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  offNewMessage: (callback: (message: Message) => void) => void;
  onExchangeUpdate: (callback: (data: any) => void) => void;
  offExchangeUpdate: (callback: (data: any) => void) => void;
  onNotification: (callback: (notification: any) => void) => void;
  offNotification: (callback: (notification: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = socketService.connect(user._id);
      
      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        socketService.disconnect();
        setIsConnected(false);
      };
    } else {
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  const joinExchangeRoom = (exchangeId: string) => {
    socketService.joinExchangeRoom(exchangeId);
  };

  const leaveExchangeRoom = (exchangeId: string) => {
    socketService.leaveExchangeRoom(exchangeId);
  };

  const sendMessage = (exchangeId: string, message: string) => {
    if (user) {
      socketService.sendMessage(exchangeId, message, user._id);
    }
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    socketService.onNewMessage(callback);
  };

  const offNewMessage = (callback: (message: Message) => void) => {
    socketService.offNewMessage(callback);
  };

  const onExchangeUpdate = (callback: (data: any) => void) => {
    socketService.onExchangeUpdate(callback);
  };

  const offExchangeUpdate = (callback: (data: any) => void) => {
    socketService.offExchangeUpdate(callback);
  };

  const onNotification = (callback: (notification: any) => void) => {
    socketService.onNotification(callback);
  };

  const offNotification = (callback: (notification: any) => void) => {
    socketService.offNotification(callback);
  };

  const value: SocketContextType = {
    socket: socketService.getSocket(),
    isConnected,
    joinExchangeRoom,
    leaveExchangeRoom,
    sendMessage,
    onNewMessage,
    offNewMessage,
    onExchangeUpdate,
    offExchangeUpdate,
    onNotification,
    offNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
