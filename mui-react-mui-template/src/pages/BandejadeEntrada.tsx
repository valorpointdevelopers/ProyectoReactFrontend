import React, { useState, useEffect, useRef } from "react";
import {
    Box, Typography, TextField, InputAdornment, Chip, IconButton,
    Paper, useTheme, CircularProgress, List, Avatar,
    AppBar, Toolbar, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { io, Socket } from "socket.io-client";

import welcomeCats from "../images/no-chat-found.svg";
import { Chat, Message } from '../types';
import config from "../config.json";
import { db } from '../db';

// ======================= SUB-COMPONENTES (Sin Cambios) ==========================
const ChatListItem: React.FC<{ chat: Chat; isSelected: boolean; onClick: () => void; }> = ({ chat, isSelected, onClick }) => {
    const theme = useTheme();
    return (
        <ListItem button onClick={onClick} sx={{ backgroundColor: isSelected ? theme.palette.action.selected : "transparent", "&:hover": { backgroundColor: theme.palette.action.hover }, borderRadius: 2, mb: 1 }}>
            <ListItemAvatar><Avatar>{chat.name ? chat.name.charAt(0) : '?'}</Avatar></ListItemAvatar>
            <ListItemText
                primary={<Typography variant="subtitle1" noWrap>{chat.name}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary" noWrap>{chat.lastMessage}</Typography>}
            />
            <Box sx={{ textAlign: 'right', ml: 1, minWidth: '50px' }}>
                <Typography variant="caption" color="text.secondary">{chat.timestamp}</Typography>
            </Box>
        </ListItem>
    );
};

const MessageInput: React.FC<{ onSendMessage: (text: string) => void; disabled?: boolean; }> = ({ onSendMessage, disabled = false }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };
    return (
        <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: 'background.default' }}>
            <TextField fullWidth variant="standard" placeholder="Escribe un mensaje..." value={text} onChange={(e) => setText(e.target.value)} disabled={disabled} InputProps={{ disableUnderline: true }} autoComplete="off" />
            <IconButton type="submit" color="primary" disabled={!text.trim() || disabled}><SendIcon /></IconButton>
        </Paper>
    );
};

const MessageStatus: React.FC<{ status?: Message['status']; }> = ({ status }) => {
    if (!status) return null;
    const iconStyles = { fontSize: '1rem', color: status === 'read' ? '#53bdeb' : 'action.active', marginLeft: '4px' };
    if (status === 'sent') return <CheckIcon sx={iconStyles} />;
    if (status === 'delivered' || status === 'read') return <DoneAllIcon sx={iconStyles} />;
    return null;
};

const ConversationView: React.FC<{ chat: Chat; messages: Message[]; onSendMessage: (text: string) => void; isLoading?: boolean; typingInfo: { jid: string, isTyping: boolean } | null; }> = ({ chat, messages, onSendMessage, isLoading, typingInfo }) => {
    const theme = useTheme();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const isTyping = typingInfo?.jid === chat.jid && typingInfo?.isTyping;
    const formatTime = (ts: number) => ts ? new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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
                        <Typography variant="body2" color="text.secondary">
                            {isTyping ? <em style={{ color: theme.palette.primary.main }}>escribiendo...</em> : chat.phoneNumber}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box flex={1} p={2} sx={{ overflowY: 'auto', backgroundColor: theme.palette.mode === 'dark' ? '#0b141a' : '#E5DDD5' }}>
                {isLoading ? <Box display="flex" justifyContent="center" alignItems="center" height="100%"><CircularProgress /></Box> :
                    messages.length > 0 ? messages.map((msg) => (
                        <Box key={msg.msgId} display="flex" justifyContent={msg.fromMe ? 'flex-end' : 'flex-start'} mb={1}>
                            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, maxWidth: '70%', backgroundColor: msg.fromMe ? (theme.palette.mode === 'dark' ? '#005c4b' : '#dcf8c6') : theme.palette.background.paper }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</Typography>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={0.5}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>{formatTime(msg.timestamp)}</Typography>
                                    {msg.fromMe && <MessageStatus status={msg.status} />}
                                </Box>
                            </Paper>
                        </Box>
                    )) :
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column" color="text.secondary">
                        <ChatBubbleOutlineIcon sx={{ fontSize: 50, mb: 2 }} />
                        <Typography>No hay mensajes en este chat.</Typography>
                    </Box>
                }
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
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [instanceId, setInstanceId] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const [typingInfo, setTypingInfo] = useState<{ jid: string, isTyping: boolean } | null>(null);

    const selectedChatRef = useRef<Chat | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const setupSockets = () => {
            const socketUrl = config.API_URL.replace('/api/', '');
            const socket = io(socketUrl, { transports: ['websocket', 'polling'] });
            socketRef.current = socket;
            const userId = localStorage.getItem('uid');

            socket.on('connect', () => {
                if (userId) socket.emit('user_connected', { userId });
            });

            socket.on('whatsapp-status', ({ status }: { status: string }) => {
                setConnectionStatus(status);
            });

            socket.on('push_new_msg', (data: any) => {
                const newMessage = data.msg;
                const messageData: Message = {
                    msgId: newMessage.msgId,
                    text: newMessage.msgContext.text || '📄 Media',
                    fromMe: newMessage.route === 'outgoing',
                    timestamp: newMessage.timestamp,
                    chatId: newMessage.remoteJid,
                    status: 'delivered',
                    type: newMessage.type,
                };
                
                db.messages.put(messageData);

                if (selectedChatRef.current?.jid === messageData.chatId) {
                    setMessages(prev => {
                        if (prev.some(msg => msg.msgId === messageData.msgId)) {
                            return prev;
                        }
                        return [...prev, messageData];
                    });
                }
                
                setChats(prev => {
                    const chatIndex = prev.findIndex(c => c.jid === messageData.chatId);
                    let newChats = [...prev];
                    const newTimestamp = new Date(messageData.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    if (chatIndex > -1) {
                        const updatedChat = { ...newChats[chatIndex], lastMessage: messageData.text, timestamp: newTimestamp };
                        newChats.splice(chatIndex, 1);
                        newChats.unshift(updatedChat);
                    } else {
                        const newChat: Chat = {
                            id: messageData.chatId,
                            jid: messageData.chatId,
                            name: newMessage.senderName || messageData.chatId.split('@')[0],
                            lastMessage: messageData.text,
                            timestamp: newTimestamp,
                            phoneNumber: messageData.chatId.split('@')[0],
                        };
                        newChats.unshift(newChat);
                    }
                    return newChats;
                });
            });
            
            socket.on('msg-status-updated', (updates: { id: string, jid: string, status: number }[]) => {
                for (const update of updates) {
                    const statusMap: { [key: number]: Message['status'] } = { 3: 'delivered', 4: 'read' };
                    const newStatus = statusMap[update.status] || 'sent';

                    db.messages.update(update.id, { status: newStatus });

                    if (selectedChatRef.current?.jid === update.jid) {
                        setMessages(prev => prev.map(m => m.msgId === update.id ? { ...m, status: newStatus } : m));
                    }
                }
            });

            socket.on('presence-update', (data: { jid: string, presence: string }) => {
                const { jid, presence } = data;
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                
                if (presence === 'composing') {
                    setTypingInfo({ jid, isTyping: true });
                    typingTimeoutRef.current = setTimeout(() => setTypingInfo({ jid, isTyping: false }), 3000);
                } else {
                    setTypingInfo({ jid, isTyping: false });
                }
            });
        };

        if (!socketRef.current) setupSockets();

        return () => {
            if (socketRef.current?.connected) socketRef.current.disconnect();
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    const fetchChats = async () => {
        setIsLoadingChats(true);
        setError(null);
        try {
            const response = await fetch(`${config.API_URL}inbox/get_my_chats`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            if (!response.ok) throw new Error('Error de red');
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                if (data.userData?.selIns) setInstanceId(data.userData.selIns);
                const transformedChats: Chat[] = data.data.map((chat: any) => {
                    let lastMessageText = 'Media';
                    try {
                        const parsed = JSON.parse(chat.last_message);
                        lastMessageText = parsed?.msgContext?.text || 'Media';
                    } catch (e) {
                        lastMessageText = chat.last_message || 'Chat iniciado';
                    }
                    return {
                        id: chat.id.toString(),
                        jid: chat.sender_jid,
                        name: chat.sender_name,
                        lastMessage: lastMessageText,
                        timestamp: chat.last_message_came ? new Date(chat.last_message_came).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        phoneNumber: chat.sender_mobile,
                    };
                });
                setChats(transformedChats);
            } else { setError(data.msg || "No se pudieron cargar los chats."); }
        } catch (err: any) { setError(err.message); } 
        finally { setIsLoadingChats(false); }
    };

    useEffect(() => { fetchChats() }, []);

    const handleSelectChat = async (chat: Chat) => {
        if (selectedChat?.id === chat.id) return;
        setSelectedChat(chat);
        selectedChatRef.current = chat;
        setIsLoadingMessages(true);

        try {
            const cachedMessages = await db.messages.where('chatId').equals(chat.jid).toArray();
            setMessages(cachedMessages.sort((a, b) => a.timestamp - b.timestamp));

            const response = await fetch(`${config.API_URL}inbox/get_convo?id=${chat.jid}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const transformedMessages: Message[] = data.data.map((msg: any) => ({
                    msgId: msg.msgId,
                    text: msg.msgContext?.text || 'Media',
                    fromMe: msg.route === 'outgoing',
                    timestamp: msg.timestamp,
                    chatId: chat.jid,
                    status: msg.status,
                    type: msg.type
                }));
                await db.messages.bulkPut(transformedMessages);
                setMessages(transformedMessages.sort((a, b) => a.timestamp - b.timestamp));
            }
        } catch (err) { console.error("Error cargando conversación:", err); } 
        finally { setIsLoadingMessages(false); }
    };

    // FUNCIÓN CORREGIDA PARA EVITAR DUPLICADOS
    const handleSendMessage = async (text: string) => {
        if (!selectedChat || !instanceId) return;

        // Ya no hacemos la actualización "optimista" aquí.
        // Solo enviamos la petición al backend.
        try {
            await fetch(`${config.API_URL}inbox/send_text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({ text, toJid: selectedChat.jid, toName: selectedChat.name, chatId: selectedChat.jid, instance: instanceId })
            });
            // El mensaje aparecerá en la UI cuando el evento 'push_new_msg' llegue por el socket.
        } catch (err) {
            console.error("Error al enviar mensaje:", err);
            // Opcional: podrías manejar un estado de error para el mensaje aquí.
        }
    };

    return (
        <Box display="flex" height="calc(100vh - 64px)" width="100%" bgcolor={theme.palette.background.default} overflow="hidden" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
            <Paper elevation={1} sx={{ width: { xs: "100%", sm: "400px" }, p: 2, borderRight: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                    <Typography variant="h5">Chats</Typography>
                    <Chip label={connectionStatus} color={connectionStatus === 'open' ? 'success' : 'warning'} size="small" />
                </Box>
                <TextField variant="outlined" size="small" placeholder="Buscar o iniciar un chat nuevo" fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }} sx={{mb: 2}} />
                
                <Box flex={1} sx={{ overflowY: 'auto' }}>
                    {isLoadingChats ? <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box> :
                        error ? <Typography color="error" padding={2}>{error}</Typography> :
                        <List sx={{ paddingRight: 1 }}>
                            {chats.map(chat => <ChatListItem key={chat.id} chat={chat} isSelected={selectedChat?.id === chat.id} onClick={() => handleSelectChat(chat)} />)}
                        </List>
                    }
                </Box>
            </Paper>

            <Box flex={1} display="flex" flexDirection="column" height="100%">
                {selectedChat ?
                    <ConversationView chat={selectedChat} messages={messages} onSendMessage={handleSendMessage} isLoading={isLoadingMessages} typingInfo={typingInfo} /> :
                    <Box flex={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{textAlign: 'center', p: 2}}>
                        <img src={welcomeCats} alt="Welcome" style={{ width: "250px", marginBottom: "16px", filter: isDark ? "invert(1)" : "none" }} />
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>Tu Bandeja de Entrada</Typography>
                        <Typography color="textSecondary">Selecciona un chat para comenzar a conversar en tiempo real.</Typography>
                    </Box>
                }
            </Box>
        </Box>
    );
};

export default BandejadeEntrada;