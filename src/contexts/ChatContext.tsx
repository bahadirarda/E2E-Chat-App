// ChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isInChatScreen: boolean;
  setIsInChatScreen: (isInChat: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isInChatScreen, setIsInChatScreen] = useState(false);

  return (
    <ChatContext.Provider value={{ isInChatScreen, setIsInChatScreen }}>
      {children}
    </ChatContext.Provider>
  );
};
