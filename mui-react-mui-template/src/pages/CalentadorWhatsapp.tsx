import React, { useState, useEffect } from "react";
import config from "../config";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Alert,
  Divider,
  Switch, 
  FormControlLabel, 
  Checkbox, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings"; 
import TextFieldsIcon from "@mui/icons-material/TextFields"; 
import InfoIcon from "@mui/icons-material/Info"; 
import chatsImage from "../images/chats.png";
import { MailIcon } from "lucide-react";

interface Message {
  id: string;
  text: string;
}

interface Instance {
  id: string;
  name: string;
}


type ActiveTab = "script" | "config";
const generateId = () => Math.random().toString(36).substr(2, 9);


interface ActivarCalentadorContentProps {
    isWarmerActive: boolean;
    setIsWarmerActive: (active: boolean) => void;
}

const ActivarCalentadorContent: React.FC<ActivarCalentadorContentProps> = ({ isWarmerActive, setIsWarmerActive }) => {
    const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
    const [instances, setInstances] = useState<Instance[]>([]);

    const fetchWarmerInstances = async () => {
        try {
            const response = await fetch(config.API_URL + "/session/get_instances_with_status", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
            });
            if (response.ok) {
                const data = await response.json();
                setInstances(data.data || data || []);
            } else {
                console.error("Failed to fetch instances.");
                setInstances([]);
            }
        } catch (error) {
            console.error("Error fetching instances:", error);
            setInstances([]);
        }
    };

    useEffect(() => {
        fetchWarmerInstances();
    }, []);

    const handleInstanceToggle = (instanceId: string) => {
        setSelectedInstances(prev => 
            prev.includes(instanceId) 
                ? prev.filter(id => id !== instanceId) 
                : [...prev, instanceId]
        );
    };

    const handleWarmerToggle = () => {
        if (!isWarmerActive && selectedInstances.length < 2) {
            alert("¡Error! Debe seleccionar al menos 2 instancias para activar el calentador.");
            return;
        }
        setIsWarmerActive(!isWarmerActive);
        console.log(`Calentador cambiado a: ${!isWarmerActive ? 'Activo' : 'APAGADO'}`);
        if (!isWarmerActive) {
            console.log("Instancias seleccionadas para calentar:", selectedInstances);
        }
    };

    
    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2, md: 3 },
                display: "flex",
                flexDirection: "column",
                gap: 3,
                bgcolor: "background.paper",
                minHeight: '400px', 
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Activar calentador
                </Typography>
            </Box>

            <Alert 
                severity="info" 
                icon={<InfoIcon />} 
                sx={{ 
                    bgcolor: 'info.light', 
                    color: 'info.contrastText', 
                    borderLeft: `5px solid ${isWarmerActive? 'error.main' : 'info.main'}`,
                    '& .MuiAlert-icon': { color: 'info.contrastText' },
                    fontWeight: 'bold'
                }}
            >
                Asegúrese de marcar al menos 2 casillas de instancias para calentar la instancia
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>Nombre de la Instancia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {instances.map((instance) => (
                            <TableRow key={instance.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedInstances.includes(instance.id)}
                                        onChange={() => handleInstanceToggle(instance.id)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {instance.name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
const AjustesCalentadorContent = () => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchMyWarmer = async () => {
    try {
      const response = await fetch(config.API_URL + "/user/get_my_warmer", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token"),},
        });

        const values = await response.json();
        console.log(values);

    } catch (error){
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyWarmer();
  }, []);
  
};



export const CalentadorWhatsapp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("script"); 
  const [isWarmerActive, setIsWarmerActive] = useState<boolean>(false); 

  const handleMessageChange = (id: string, newText: string) => {
    const newMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, text: newText } : msg
    );
    setMessages(newMessages);
    setSaveStatus("idle");
  };

  const handleAddMessage = () => {
    const newId = generateId();
    const newMessages = [...messages, { id: newId, text: "" }];
    setMessages(newMessages);
    setEditingId(newId);
    setSaveStatus("idle");
  };

  const handleFinishEditing = async (message: Message) => {
    if (message.text.trim() === "") {
      setSaveStatus("error");
      return;
    }

    try {
      const response = await fetch(config.API_URL + "/user/add_warmer_msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ msg: message.text }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.msg || "Failed to save message");
      }

      console.log("Saved message:", data.msg);
      
      setEditingId(null);
      setSaveStatus("success"); 

    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  const handleCancelEditing = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    setEditingId(null);
    setSaveStatus("idle");
  };

  useEffect(() => {
    const fetchWarmer = async () => {
      try {
        const response = await fetch(config.API_URL + "/user/get_warmer_msg", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();

        let messageData = [];

        if (Array.isArray(data)) {
          messageData = data;
        } else if (data && Array.isArray(data.messages)) {
          messageData = data.messages;
        } else if (data && Array.isArray(data.data)) {
          messageData = data.data;
        } else if (data && Array.isArray(data.warmer_msg)) {
          messageData = data.warmer_msg;
        } else {
          console.error("Received data is not in a recognized format:", data);
          return;
        }

        const messagesWithId = messageData.map((msg: any) => ({
          text: msg.text || msg.message || msg.msg || "",
          id: msg.id || generateId(),
        }));

        setMessages(messagesWithId);
      } catch (error) {
        console.log("Error fetching warmer messages:", error);
      }
    };

    fetchWarmer();
  }, []);

  
  const renderContent = () => {
    if (activeTab === "config") {
      return (
        <>
            <ActivarCalentadorContent 
                isWarmerActive={isWarmerActive} 
                setIsWarmerActive={setIsWarmerActive} 
            />
            
        </>
      );
    }
    
    return (
        <>
            <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 2 }}>
                Agregar mensajes de script de calentamiento
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    bgcolor: "background.paper",
                }}
            >
                {messages.map((message, index) => (
                    <TextField
                        key={message.id}
                        fullWidth
                        multiline
                        rows={2}
                        value={message.text}
                        inputProps={{ readOnly: editingId !== message.id }}
                        onChange={(e) => handleMessageChange(message.id, e.target.value)}
                        placeholder={`Mensaje ${index + 1}`}
                        error={saveStatus === "error" && message.text.trim() === "" && editingId === message.id}
                        helperText={
                            saveStatus === "error" && message.text.trim() === "" && editingId === message.id
                                ? "El mensaje no puede estar vacío"
                                : ""
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {editingId === message.id && (
                                        <>
                                            <IconButton
                                                edge="end"
                                                color="success"
                                                onClick={() => handleFinishEditing(message)}
                                                aria-label="finish editing"
                                            >
                                                <DoneIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleCancelEditing(message.id)}
                                                aria-label="cancel editing"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                ))}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddMessage}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Añadir Mensaje
                    </Button>
                </Box>
            </Paper>

            {saveStatus === "success" && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    ¡Mensaje guardado exitosamente!
                </Alert>
            )}
        </>
    );
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 3,
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        gap: 4,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 2,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={chatsImage}
            alt="Chats illustration"
            sx={{ width: "100%", height: "auto", mb: 2 }}
          />

          <Typography
            variant="body2"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
          >
            Calentar su WhatsApp antes de enviar una campaña o mensaje de texto con
            el Calentador es la mejor manera de reducir el riesgo de ser baneado.
          </Typography>
          
          <Divider sx={{ width: '100%', my: 1 }} />

          <Button
            variant="text"
            startIcon={<MailIcon />}
            fullWidth
            onClick={() => setActiveTab("script")}
            sx={{ 
              justifyContent: "flex-start", 
              fontWeight: activeTab === "script" ? 'bold' : 'normal',
              bgcolor: activeTab === "script" ? 'action.selected' : 'transparent',
              "&:hover": {
                bgcolor: activeTab === "script" ? 'action.selected' : 'action.hover',
              }
            }}
          >
            Script de calentamiento
          </Button>

          <Button
            variant="text"
            startIcon={<SettingsIcon />}
            fullWidth
            onClick={() => setActiveTab("config")}
            sx={{ 
              justifyContent: "flex-start",
              fontWeight: activeTab === "config" ? 'bold' : 'normal',
              bgcolor: activeTab === "config" ? 'action.selected' : 'transparent',
              "&:hover": {
                bgcolor: activeTab === "config" ? 'action.selected' : 'action.hover',
              }
            }}
          >
            Configurar calentador
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default CalentadorWhatsapp;
