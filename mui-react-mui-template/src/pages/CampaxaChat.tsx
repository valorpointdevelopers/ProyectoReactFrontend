import React, { useState, useEffect, useCallback } from "react";
import { Home, Radio, Plus, Send, Pencil, Trash2, Menu } from "lucide-react";
import sendingImg from "../images/sending.svg";
import {
    Box, Button, Card, CardContent, Typography, Table, TableHead,
    TableRow, TableCell, TableBody, TextField, Grid, FormControlLabel,
    Switch, Select, MenuItem, IconButton, Divider, TableContainer,
    Drawer, useMediaQuery, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import config from "../config.json";

// --- TIPOS DE DATOS DEL BACKEND ---
interface Instance {
    id: number;
    instance_id: string;
    title: string;
}

interface Flow {
    id: number;
    flow_id: string;
    title: string;
}

interface Phonebook {
    id: number;
    phonebook_id: string;
    title: string;
}

interface Template {
    id: number;
    title: string;
    content: string;
}

interface Chatbot {
    id: number;
    title: string;
    for_all: number;
    flow: string; 
    active: number;
    instance_id: string;
    prevent_book_id: string | null;
}

interface Campaign {
    id: number;
    broadcast_id: string;
    title: string;
    templet: string;
    phonebook: string;
    status: string;
    schedule: string;
    delay_from: string;
    delay_to: string;
    timezone: string;
}

export default function CampaxaChat() {
    const [activeMenu, setActiveMenu] = useState<"chatbot" | "campanas">("chatbot");
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // --- ESTADOS GENERALES ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    // --- ESTADOS PARA DROPDOWNS ---
    const [instances, setInstances] = useState<Instance[]>([]);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [phonebooks, setPhonebooks] = useState<Phonebook[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    // --- ESTADO CHATBOTS ---
    const [showAddChatbot, setShowAddChatbot] = useState(false);
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [titulo, setTitulo] = useState("");
    const [paraTodos, setParaTodos] = useState(true);
    const [flujo, setFlujo] = useState<Flow | null>(null);
    const [activo, setActivo] = useState(true);
    const [instancia, setInstancia] = useState("");
    const [editChatbot, setEditChatbot] = useState<Chatbot | null>(null);
    const [deleteChatbotId, setDeleteChatbotId] = useState<number | null>(null);

    // --- ESTADO CAMPAÑAS ---
    const [showAddCampana, setShowAddCampana] = useState(false);
    const [campanas, setCampanas] = useState<Campaign[]>([]);
    const [campTitulo, setCampTitulo] = useState("");
    const [plantilla, setPlantilla] = useState<{ id: number, title: string } | null>(null);
    const [agenda, setAgenda] = useState<{ id: number, phonebook_id: string, title: string } | null>(null);
    const [programar, setProgramar] = useState("");
    const [retrasoDesde, setRetrasoDesde] = useState("00:01");
    const [retrasoHasta, setRetrasoHasta] = useState("00:05");
    const [zonaHoraria, setZonaHoraria] = useState("America/Mexico_City");
    const [editCampana, setEditCampana] = useState<Campaign | null>(null);
    const [deleteCampanaId, setDeleteCampanaId] = useState<string | null>(null);

    // --- API HELPER ---
    const apiCall = useCallback(async (endpoint: string, method: string = 'GET', body: object | null = null) => {
        try {
            const headers: HeadersInit = {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            };
            const options: RequestInit = { method, headers };
            if (body) {
                headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${config.API_URL}${endpoint}`, options);
            
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.success === false) {
                    throw new Error(data.msg || 'La API indicó un error');
                }
                return data;
            } else {
                const responseText = await response.text();
                console.error("La respuesta de la API no es JSON. Contenido recibido:", responseText);
                throw new Error(`Respuesta inesperada del servidor para el endpoint: ${endpoint}`);
            }
        } catch (err: any) {
            setError(err.message);
            console.error(`Error en la llamada a ${endpoint}:`, err);
            throw err;
        }
    }, []);

    // --- CARGA DE DATOS INICIAL ---
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [
                chatbotsData, campaignsData, instancesData, flowsData, phonebooksData, templatesData, meData
            ] = await Promise.all([
                apiCall('chatbot/get_mine'),
                apiCall('broadcast/my_broadcast'),
                apiCall('session/get_instances_with_status'),
                apiCall('flow/get_mine'),
                apiCall('user/get_phonebooks'),
                apiCall('templet/my_templet'),
                apiCall('user/get_me')
            ]);
            setChatbots(chatbotsData.data);
            setCampanas(campaignsData.data);
            setInstances(instancesData.data.map((d: any) => d.i));
            setFlows(flowsData.data);
            setPhonebooks(phonebooksData.data);
            setTemplates(templatesData.data);
            setUserId(meData.data.id);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    }, [apiCall]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // --- MANEJADORES CHATBOT ---
    const handleEnviarChatbot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !instancia || !flujo) {
            setError("Por favor, completa todos los campos requeridos.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            if (editChatbot) {
                const payload = {
                    id: editChatbot.id,
                    title: titulo,
                    instance_id: instancia,
                    flow: flujo, // ✅ CORREGIDO: Enviar el objeto de flujo completo
                    for_all: paraTodos,
                    prevent_book_id: null,
                };
                await apiCall('chatbot/update_bot', 'POST', payload);
            } else {
                if (!userId) {
                    throw new Error("No se pudo obtener el ID del usuario. Inténtalo de nuevo.");
                }
                const payload = {
                    add: true,
                    title: titulo,
                    instance_id: instancia,
                    flow: flujo, // ✅ CORREGIDO: Enviar el objeto de flujo completo
                    for_all: paraTodos,
                    prevent_book_id: null,
                    id: userId,
                };
                await apiCall('chatbot/add_bot', 'POST', payload);
            }
            setShowAddChatbot(false);
            setEditChatbot(null);
            resetChatbotForm();
            await fetchInitialData();
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteChatbot = async () => {
        if (deleteChatbotId === null) return;
        try {
            await apiCall('chatbot/del_bot', 'POST', { id: deleteChatbotId });
            setChatbots(prev => prev.filter(c => c.id !== deleteChatbotId));
            setDeleteChatbotId(null);
        } catch (err) {
        }
    };
    
    const handleToggleChatbotStatus = async (bot: Chatbot) => {
        const newStatus = !bot.active;
        setChatbots(prev => prev.map(b => b.id === bot.id ? { ...b, active: newStatus ? 1 : 0 } : b));
        try {
            await apiCall('chatbot/change_bot_status', 'POST', { botId: bot.id, status: newStatus });
        } catch (err) {
            setChatbots(prev => prev.map(b => b.id === bot.id ? { ...b, active: bot.active } : b));
        }
    };
    
    const resetChatbotForm = () => {
        setTitulo("");
        setParaTodos(true);
        setFlujo(null);
        setActivo(true);
        setInstancia("");
        setEditChatbot(null);
    };

    // --- MANEJADORES CAMPAÑAS ---
    const handleEnviarCampana = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campTitulo || !plantilla || !agenda) {
            setError("Título, plantilla y agenda son requeridos.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                title: campTitulo,
                templet: plantilla,
                phonebook: agenda,
                schedule: !!programar,
                scheduleTimestamp: programar ? new Date(programar).getTime() : null,
                timezone: zonaHoraria,
                instance_id: instancia,
                delay_from: retrasoDesde.split(':')[1],
                delay_to: retrasoHasta.split(':')[1],
            };
            await apiCall('broadcast/add_broadcast', 'POST', payload);
            setShowAddCampana(false);
            setEditCampana(null);
            resetCampanaForm();
            await fetchInitialData();
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteCampana = async () => {
        if (deleteCampanaId === null) return;
        try {
            await apiCall('broadcast/del_broadcast', 'POST', { broadcast_id: deleteCampanaId });
            setCampanas(prev => prev.filter(c => c.broadcast_id !== deleteCampanaId));
            setDeleteCampanaId(null);
        } catch (err) {
        }
    };

    const resetCampanaForm = () => {
        setCampTitulo("");
        setPlantilla(null);
        setAgenda(null);
        setProgramar("");
        setRetrasoDesde("00:01");
        setRetrasoHasta("00:05");
        setZonaHoraria("America/Mexico_City");
    };

    const drawerContent = (
        <Box p={2} width={isMobile ? 250 : 220}>
            <Box display="flex" justifyContent="center" mb={2}>
                <img src={sendingImg} alt="Logo" style={{ width: "80px", height: "auto" }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Button
                fullWidth startIcon={<Home size={18} />}
                sx={{ justifyContent: "flex-start", mb: 1, bgcolor: activeMenu === "chatbot" ? "primary.main" : "transparent", color: activeMenu === "chatbot" ? "white" : "inherit", '&:hover': { bgcolor: activeMenu === "chatbot" ? 'primary.dark' : 'action.hover' } }}
                onClick={() => { setActiveMenu("chatbot"); setMobileOpen(false); }}
            >Chatbot</Button>
            <Button
                fullWidth startIcon={<Radio size={18} />}
                sx={{ justifyContent: "flex-start", mb: 1, bgcolor: activeMenu === "campanas" ? "primary.main" : "transparent", color: activeMenu === "campanas" ? "white" : "inherit", '&:hover': { bgcolor: activeMenu === "campanas" ? 'primary.dark' : 'action.hover' } }}
                onClick={() => { setActiveMenu("campanas"); setMobileOpen(false); }}
            >Campañas</Button>
        </Box>
    );

    return (
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} sx={{ height: 'calc(100vh - 64px)' }}>
            {isMobile ? (
                <>
                    <IconButton onClick={() => setMobileOpen(true)} sx={{ m: 1, alignSelf: 'flex-start' }}>
                        <Menu />
                    </IconButton>
                    <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
                        {drawerContent}
                    </Drawer>
                </>
            ) : (
                <Box component={Card} variant="outlined" sx={{ borderRadius: 0 }}>{drawerContent}</Box>
            )}

            <Box flexGrow={1} p={3} sx={{ overflowY: 'auto' }}>
                <Typography variant="h4" mb={2} fontWeight={700}>
                    {activeMenu === "chatbot" ? "Chatbots" : "Campañas"}
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

                {activeMenu === "chatbot" && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight={600}>
                                Tus Chatbots
                            </Typography>
                            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { resetChatbotForm(); setShowAddChatbot(true); }}>
                                Agregar
                            </Button>
                        </Box>

                        {(showAddChatbot || editChatbot) && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>{editChatbot ? 'Editar Chatbot' : 'Nuevo Chatbot'}</Typography>
                                    <Box component="form" onSubmit={handleEnviarChatbot}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField fullWidth size="small" label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required/>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Select fullWidth size="small" displayEmpty value={instancia} onChange={(e) => setInstancia(e.target.value)} required>
                                                    <MenuItem value="" disabled>Seleccionar instancia</MenuItem>
                                                    {instances.map(i => <MenuItem key={i.id} value={i.instance_id}>{i.title}</MenuItem>)}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Select fullWidth size="small" displayEmpty value={flujo?.id || ""} onChange={(e) => setFlujo(flows.find(f => f.id === e.target.value) || null)} required>
                                                    <MenuItem value="" disabled>Seleccionar flujo</MenuItem>
                                                    {flows.map(f => <MenuItem key={f.id} value={f.id}>{f.title}</MenuItem>)}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControlLabel control={<Switch checked={paraTodos} onChange={(e) => setParaTodos(e.target.checked)} />} label="Para todos los contactos" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                                    <Button variant="outlined" color="secondary" onClick={() => { setShowAddChatbot(false); setEditChatbot(null); }}>Cerrar</Button>
                                                    <Button type="submit" variant="contained" startIcon={<Send size={16} />} disabled={isSubmitting}>
                                                        {isSubmitting ? <CircularProgress size={24} /> : (editChatbot ? "Guardar cambios" : "Crear Chatbot")}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Card>
                            <CardContent>
                                {isLoading ? <CircularProgress /> :
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Título</TableCell>
                                                <TableCell>Instancia</TableCell>
                                                <TableCell>Flujo</TableCell>
                                                <TableCell>Para todos</TableCell>
                                                <TableCell>Activo</TableCell>
                                                <TableCell align="right">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {chatbots.map((bot) => {
                                                // ✅ INICIO DE LA CORRECCIÓN DE VISUALIZACIÓN
                                                let flowTitle = 'N/A';
                                                let flowObjectFromBot: Flow | null = null;
                                                try {
                                                    // bot.flow es un string JSON: '{"id":1,"flow_id":"xyz...","title":"Mi Flujo"}'
                                                    flowObjectFromBot = JSON.parse(bot.flow);
                                                    flowTitle = flowObjectFromBot?.title || 'N/A';
                                                } catch (e) {
                                                    // Si falla el parseo (dato antiguo o incorrecto), se queda como 'N/A'
                                                    console.error("No se pudo parsear el flujo del bot:", bot.flow);
                                                }
                                                // ✅ FIN DE LA CORRECCIÓN DE VISUALIZACIÓN

                                                return (
                                                    <TableRow key={bot.id}>
                                                        <TableCell>{bot.title}</TableCell>
                                                        <TableCell>{instances.find(i => i.instance_id === bot.instance_id)?.title || bot.instance_id}</TableCell>
                                                        <TableCell>{flowTitle}</TableCell>
                                                        <TableCell>{bot.for_all ? "Sí" : "No"}</TableCell>
                                                        <TableCell>
                                                            <Switch checked={!!bot.active} onChange={() => handleToggleChatbotStatus(bot)} />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton size="small" onClick={() => {
                                                                // ✅ LÓGICA DE EDICIÓN CORREGIDA
                                                                const flowIdToFind = flowObjectFromBot?.flow_id || null;
                                                                const selectedFlow = flows.find(f => f.flow_id === flowIdToFind);
                                                                
                                                                setEditChatbot(bot);
                                                                setTitulo(bot.title);
                                                                setInstancia(bot.instance_id);
                                                                setParaTodos(!!bot.for_all);
                                                                setFlujo(selectedFlow || null);
                                                                setActivo(!!bot.active);
                                                                setShowAddChatbot(true);
                                                            }}>
                                                                <Pencil size={16} />
                                                            </IconButton>
                                                            <IconButton size="small" color="error" onClick={() => setDeleteChatbotId(bot.id)}>
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* --- SECCIÓN DE CAMPAÑAS--- */}
                {activeMenu === "campanas" && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight={600}>Tus Campañas</Typography>
                            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditCampana(null); resetCampanaForm(); setShowAddCampana(true); }}>
                                Agregar
                            </Button>
                        </Box>
                        {(showAddCampana || editCampana) && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>{editCampana ? 'Editar Campaña' : 'Nueva Campaña'}</Typography>
                                    <Box component="form" onSubmit={handleEnviarCampana}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Título" value={campTitulo} onChange={(e) => setCampTitulo(e.target.value)} required /></Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Select fullWidth size="small" value={instancia} onChange={(e) => setInstancia(e.target.value)} displayEmpty required>
                                                    <MenuItem value="" disabled>Seleccionar Instancia</MenuItem>
                                                    {instances.map(i => <MenuItem key={i.id} value={i.instance_id}>{i.title}</MenuItem>)}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Select fullWidth size="small" value={plantilla?.id || ""} onChange={(e) => setPlantilla(templates.find(t => t.id === e.target.value) || null)} displayEmpty required>
                                                    <MenuItem value="" disabled>Seleccionar Plantilla</MenuItem>
                                                    {templates.map(t => <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>)}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Select fullWidth size="small" value={agenda?.id || ""} onChange={(e) => setAgenda(phonebooks.find(p => p.id === e.target.value) || null)} displayEmpty required>
                                                    <MenuItem value="" disabled>Seleccionar Agenda</MenuItem>
                                                    {phonebooks.map(p => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" type="datetime-local" label="Programar (opcional)" InputLabelProps={{ shrink: true }} value={programar} onChange={(e) => setProgramar(e.target.value)} /></Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Select fullWidth size="small" value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)}>
                                                     <MenuItem value="America/Mexico_City">México</MenuItem>
                                                     <MenuItem value="America/Bogota">Colombia</MenuItem>
                                                     <MenuItem value="America/Lima">Perú</MenuItem>
                                                     <MenuItem value="Europe/Madrid">España</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Retraso Desde (segundos)" type="number" value={retrasoDesde} onChange={(e) => setRetrasoDesde(e.target.value)} /></Grid>
                                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Retraso Hasta (segundos)" type="number" value={retrasoHasta} onChange={(e) => setRetrasoHasta(e.target.value)} /></Grid>
                                            
                                            <Grid item xs={12}>
                                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                                    <Button variant="outlined" color="secondary" onClick={() => { setShowAddCampana(false); setEditCampana(null); }}>Cerrar</Button>
                                                    <Button type="submit" variant="contained" startIcon={<Send size={16} />} disabled={isSubmitting}>
                                                        {isSubmitting ? <CircularProgress size={24} /> : (editCampana ? "Guardar cambios" : "Crear Campaña")}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardContent>
                                {isLoading ? <CircularProgress /> :
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Título</TableCell>
                                                <TableCell>Plantilla</TableCell>
                                                <TableCell>Agenda</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Programado</TableCell>
                                                <TableCell align="right">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {campanas.map((c) => (
                                                <TableRow key={c.id}>
                                                    <TableCell>{c.title}</TableCell>
                                                    <TableCell>{JSON.parse(c.templet).title}</TableCell>
                                                    <TableCell>{JSON.parse(c.phonebook).title}</TableCell>
                                                    <TableCell>{c.status}</TableCell>
                                                    <TableCell>{c.schedule ? new Date(c.schedule).toLocaleString() : 'No programado'}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" color="error" onClick={() => setDeleteCampanaId(c.broadcast_id)}>
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>}
                            </CardContent>
                        </Card>
                    </>
                )}

                <Dialog open={deleteChatbotId !== null} onClose={() => setDeleteChatbotId(null)}>
                    <DialogTitle>Eliminar Chatbot</DialogTitle>
                    <DialogContent><Typography>¿Seguro que quieres eliminar este chatbot?</Typography></DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteChatbotId(null)}>Cancelar</Button>
                        <Button color="error" onClick={handleDeleteChatbot}>Eliminar</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteCampanaId !== null} onClose={() => setDeleteCampanaId(null)}>
                    <DialogTitle>Eliminar Campaña</DialogTitle>
                    <DialogContent><Typography>¿Seguro que quieres eliminar esta campaña?</Typography></DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteCampanaId(null)}>Cancelar</Button>
                        <Button color="error" onClick={handleDeleteCampana}>Eliminar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}