export interface Chat {
  id: string;
  jid: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  phoneNumber: string;
  avatar?: string;
}

export interface Message {
  msgId: string;
  type: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  chatId: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
  senderName?: string;
}