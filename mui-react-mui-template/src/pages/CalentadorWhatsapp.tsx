import React, { useState, useEffect } from "react";
import config from "../config";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
    Divider,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch, 
    FormControlLabel,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import chatsImage from "../images/chats.png";
import { Forum, Help, NearMe } from "@mui/icons-material";

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
                
                const rawInstances = data.data || data || [];
                
                const mappedInstances: Instance[] = rawInstances.map((item: any) => ({
                    id: item.i?.instance_id || item.i?.id?.toString() || item.i?.uid || generateId(),
                    name: item.i?.title || item.userData?.name || "Instancia sin nombre",
                }));

                setInstances(mappedInstances);
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

    const fetchAddIns = async() => {
        try {
            const response = await fetch(config.API_URL + "/user/add_ins_to_warm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
        } catch (error){
            console.log(error);
        } 
    }

    //const

    const handleWarmerToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newActiveState = event.target.checked;
        if (newActiveState && selectedInstances.length < 2) {
            alert("Seleccione al menos 2 instancias para activar el calentador");
            return;
        }
        setIsWarmerActive(newActiveState);
        console.log(`Calentador cambiado a: ${newActiveState ? 'Activo' : 'APAGADO'}`);
        if (newActiveState) {
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
                icon={<Help />}
                sx={{
                    bgcolor: 'rgba(2, 139, 237, 1)',
                    color: '#ffffffff',
                    borderLeft: `5px solid ${isWarmerActive? 'error.main' : 'info.main'}`,
                    '& .MuiAlert-icon': { color: '#FFFFFF' },
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
                            <TableCell>Lista de instancias disponibles:</TableCell>
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isWarmerActive}
                            onChange={handleWarmerToggle}
                            color={isWarmerActive ? "error" : "success"}
                        />
                    }
                    label={
                        <Typography variant="button" sx={{ fontWeight: 'bold', color: isWarmerActive ? 'error.main' : 'success.main' }}>
                            {isWarmerActive ? 'Desactivar Calentador' : 'Activar Calentador'}
                        </Typography>
                    }
                    labelPlacement="start" 
                />
            </Box>
        </Paper>
    );
}

    const fetchMyWarmer = async () => {
        try {
            const response = await fetch(config.API_URL + "/user/get_my_warmer", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token"),},
            });

            const data = await response.json();
            console.log(data);

        } catch (error){
            console.log(error);
        }
    }; 

    fetchMyWarmer();

    
export const CalentadorWhatsapp = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [newMessageText, setNewMessageText] = useState<string>(""); 
    const [activeTab, setActiveTab] = useState<ActiveTab>("script");
    const [isWarmerActive, setIsWarmerActive] = useState<boolean>(false);

    const handleAddMessage = async () => {
        const textToSave = newMessageText.trim();
        if (textToSave === "") {
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
                body: JSON.stringify({ msg: textToSave }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.msg || "Failed to save message");
            }

            console.log("Saved message:", data.msg);

            const newId = generateId(); 
            setMessages(prev => [...prev, { id: newId, text: textToSave }]);
            setNewMessageText(""); 
            setSaveStatus("success");

        } catch (error) {
            console.error(error);
            setSaveStatus("error");
        }
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
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={newMessageText}
                        onChange={(e) => {
                            setNewMessageText(e.target.value);
                            setSaveStatus("idle");
                        }}
                        placeholder="Ingrese mensaje..."
                        error={saveStatus === "error" && newMessageText.trim() === ""}
                        helperText={
                            saveStatus === "error" && newMessageText.trim() === ""
                                ? "El mensaje no puede estar vacío"
                                : ""
                        }
                        InputProps={{
                            endAdornment: (
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<NearMe />}
                                        onClick={handleAddMessage}
                                        disabled={newMessageText.trim() === ""} 
                                    >
                                        Enviar
                                    </Button>
                                </Box>
                            )
                        }}
                    />


                    {messages.map((message, index) => (
                        <TextField
                            key={message.id}
                            fullWidth
                            multiline
                            rows={2}
                            value={message.text}
                            inputProps={{ readOnly: true }} 
                            placeholder={`Mensaje ${index + 1}`}
                            InputProps={{
                                endAdornment: (
                                        null
                                ),
                            }}
                        />
                    ))}
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
                        startIcon={<Forum />}
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