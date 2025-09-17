import React, { useState, useEffect, useRef } from "react";
import {
  Box, Typography, TextField, InputAdornment, Select, MenuItem, IconButton,
  Paper, useTheme, CircularProgress, List, Avatar,
  AppBar, Toolbar, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventIcon from "@mui/icons-material/Event";
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { io, Socket } from "socket.io-client";

import welcomeCats from "../images/no-chat-found.svg";
import { Chat, Message } from '../types';
import config from "../config.json";

// ======================= SUB-COMPONENTES ==========================
interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isSelected, onClick }) => {
  const theme = useTheme();
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        backgroundColor: isSelected ? theme.palette.action.selected : "transparent",
        "&:hover": { backgroundColor: theme.palette.action.hover },
        borderRadius: 2,
        mb: 1
      }}
    >
      <ListItemAvatar>
        <Avatar>{chat.name ? chat.name.charAt(0) : '?'}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="subtitle1" noWrap>{chat.name}</Typography>}
        secondary={<Typography variant="body2" color="text.secondary" noWrap>{chat.lastMessage}</Typography>}
      />
      <Box sx={{ textAlign: 'right', ml: 1 }}>
        <Typography variant="caption" color="text.secondary">{chat.timestamp}</Typography>
      </Box>
    </ListItem>
  );
};

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={2}
      sx={{
        p: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'background.default'
      }}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        InputProps={{ disableUnderline: true }}
        autoComplete="off"
      />
      <IconButton type="submit" color="primary" disabled={!text.trim() || disabled}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

type MessageStatusProps = {
  status?: 'sent' | 'delivered' | 'read' | 'error';
};

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  if (!status) return null;
  const iconStyles = { fontSize: '1rem', color: status === 'read' ? '#53bdeb' : 'action.active', marginLeft: '4px' };
  if (status === 'sent') return <CheckIcon sx={iconStyles} />;
  if (status === 'delivered' || status === 'read') return <DoneAllIcon sx={iconStyles} />;
  return null;
};

interface ConversationViewProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({ chat, messages, onSendMessage, isLoading }) => {
  const theme = useTheme();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const formatTime = (ts: number) => {
    if (!ts) return '';
    return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>{chat.name ? chat.name.charAt(0) : '?'}</Avatar>
          <Box>
            <Typography variant="h6">{chat.name}</Typography>
            <Typography variant="body2" color="text.secondary">{chat.phoneNumber}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        flex={1}
        p={2}
        sx={{
          overflowY: 'auto',
          backgroundColor: theme.palette.mode === 'dark' ? '#0b141a' : '#E5DDD5'
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <Box
              key={msg.msgId || Math.random()}
              display="flex"
              justifyContent={msg.fromMe ? 'flex-end' : 'flex-start'}
              mb={1}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '70%',
                  backgroundColor: msg.fromMe
                    ? (theme.palette.mode === 'dark' ? '#005c4b' : '#dcf8c6')
                    : theme.palette.background.paper
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {msg.text}
                </Typography>
                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={0.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                  {msg.fromMe && <MessageStatus status={msg.status} />}
                </Box>
              </Paper>
            </Box>
          ))
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column" color="text.secondary">
            <ChatBubbleOutlineIcon sx={{ fontSize: 50, mb: 2 }} />
            <Typography>No hay mensajes en este chat.</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box p={1} sx={{ backgroundColor: 'background.default' }}>
        <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
      </Box>
    </Box>
  );
};

// ======================= COMPONENTE PRINCIPAL ==========================
const BandejadeEntrada: React.FC = () => {
 const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const selectedChatRef = useRef<Chat | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const socketUrl = config.API_URL.replace('/api/', '');
  const newSocket = io(socketUrl, { transports: ['websocket', 'polling'] });
  const [status, setStatus] = useState('connecting');
  useEffect(() => {
    let userId = localStorage.getItem('uid');
    console.log(userId);
    newSocket.on('connect', () => console.log('✅ Conectado al servidor de Sockets con ID:', newSocket.id));
    newSocket.emit('user_connected', { userId });

    newSocket.on('whatsapp-status', ({ status: newStatus }) => {
      console.log({ 'get status': newStatus });
      setStatus(newStatus);
    });

    newSocket.on('update_conversations', (message) => {
      console.log(message);

      setMessages([...message, message]);
    });
 newSocket.on('push_new_msg', (newMessage: Message) => {
   console.log(newMessage);
   console.log(chats);
   // setChats(..chat, )
      setChats(prev =>
        prev.map((chat: Chat) =>
          chat.jid === newMessage.chatId
            ? { ...chat, lastMessage: newMessage.text, timestamp: new Date(newMessage.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : chat
        )
      );
    });

    return () => { };
  }, []);

  // ================= FETCH CHATS =================
  const fetchChats = async () => {
    setIsLoadingChats(true);
    setError(null);

    try {
      const response = await fetch(`${config.API_URL}inbox/get_my_chats`, {
        cache: 'no-cache',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        if (data.userData?.selIns) setInstanceId(data.userData.selIns);

        const transformedChats: Chat[] = (data.data as any[])
          .map((chat: any) => {
            const jidRaw = chat.sender_jid || chat.chat_id;
            const jid = jidRaw.includes('@') ? jidRaw : `${jidRaw}@c.us`;

            let lastMsgText = '';
            try {
              const parsed = JSON.parse(chat.last_message);
              lastMsgText = parsed?.msgContext?.text || '';
            } catch (e) {
              lastMsgText = chat.last_message || '';
            }

            const timestamp = chat.last_message_came
              ? new Date(chat.last_message_came).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return {
              id: chat.id.toString(),
              jid,
              name: chat.sender_name,
              lastMessage: lastMsgText || 'No hay mensajes',
              timestamp,
              phoneNumber: chat.sender_mobile || (jid.split('@')[0])
            } as Chat;
          })
          .filter((c: Chat) => !!c.jid);

        setChats(transformedChats);
      } else {
        setError(data.msg || "Respuesta no exitosa.");
      }
    } catch (err) {
      console.error("Error cargando chats:", err);
      setError("Error de conexión al cargar chats.");
    } finally {
      setIsLoadingChats(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  // ================= SELECCIONAR CHAT =================
  const handleSelectChat = async (chat: Chat) => {
    if (selectedChat?.id === chat.id) return;
    setSelectedChat(chat);
    selectedChatRef.current = chat;
    setIsLoadingMessages(true);
    setMessages([]);
    try {
      const response = await fetch(`${config.API_URL}inbox/get_convo?id=${chat.jid}`, {
        cache: 'no-cache',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const transformedMessages: Message[] = data.data.map((msg: any) => ({
          msgId: msg.msgId,
          type: msg.type,
          text: msg.msgContext?.text || '',
          fromMe: msg.route === 'outgoing',
          timestamp: msg.timestamp,
          chatId: chat.jid,
          status: msg.status
        }));
        setMessages(transformedMessages);
      }
    } catch (err) {
      console.error("Error cargando conversación:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // ================= ENVIAR MENSAJE =================
  const handleSendMessage = async (text: string) => {
    if (!selectedChat || !instanceId) return;

    const tempMessage: Message = {
      msgId: `temp_${Date.now()}`,
      text,
      fromMe: true,
      timestamp: Math.floor(Date.now() / 1000),
      type: 'text',
      chatId: selectedChat.jid,
      status: 'sent'
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch(`${config.API_URL}inbox/send_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          text,
          toJid: selectedChat.jid,
          chatId: selectedChat.jid,
          toName: selectedChat.name,
          instance: instanceId
        })
      });
      const data = await res.json();
      if (!data.success) console.error("❌ Error enviando mensaje:", data.msg);
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }
  };

  return (
    <Box
      display="flex"
      height="calc(100vh - 64px)"
      width="100%"
      bgcolor={theme.palette.background.default}
      overflow="hidden"
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      {/* Sidebar de chats */}
      <Paper
        elevation={1}
        sx={{
          width: { xs: "100%", sm: "350px" },
          p: 2,
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display="flex" gap={1} mb={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
          <TextField variant="outlined" size="small" placeholder="Número de teléfono" fullWidth />
          <TextField variant="outlined" size="small" placeholder="Nombre" fullWidth />
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Select size="small" fullWidth defaultValue="whatsapp">
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="todos">Todos los chats</MenuItem>
          </Select>
          <IconButton color="success"><WhatsAppIcon /></IconButton>
          <IconButton color="primary"><EventIcon /></IconButton>
        </Box>
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          {isLoadingChats ? (
            <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error" padding={2}>{error}</Typography>
          ) : (
            <List sx={{ paddingRight: 1 }}>
              {chats.map(chat => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isSelected={selectedChat?.id === chat.id}
                  onClick={() => handleSelectChat(chat)}
                />
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* Panel de conversación */}
      <Box flex={1} display="flex" flexDirection="column" height="100%">
        {selectedChat ? (
          <ConversationView
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingMessages}
          />
        ) : (
          <Box flex={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <img
              src={welcomeCats}
              alt="Welcome"
              style={{
                width: "200px",
                marginBottom: "16px",
                filter: isDark ? "invert(1)" : "none"
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>WELCOME</Typography>
            <Typography color="textSecondary">Selecciona un chat para comenzar a conversar.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BandejadeEntrada;