import React, { useMemo, useState, FC, ReactNode } from "react";
import { Home, Radio, Plus, X, Send, Pencil, Trash2, Menu, Save } from "lucide-react";
import sendingImg from "../images/sending.svg";
import {
  Box, Button, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, TextField, Grid, FormControlLabel, Switch,
  Select, MenuItem, IconButton, Divider, useMediaQuery, Drawer, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type ChatbotRow = {
  id: number;
  titulo: string;
  paraTodos: boolean;
  flujo: string;
  activo: boolean;
  instancia: string;
};

type CampanaRow = {
  id: number;
  titulo: string;
  plantilla: string;
  agenda: string;
  estado: string;
  programar: string;
  retrasoDesde: string;
  retrasoHasta: string;
  zonaHoraria: string;
};

interface SidebarNavButtonProps {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  isDark: boolean;
  onClick: () => void;
}

const SidebarNavButton: FC<SidebarNavButtonProps> = ({ label, icon, isActive, isDark, onClick }) => (
  <Button
    startIcon={icon}
    onClick={onClick}
    sx={{
      justifyContent: "flex-start",
      borderRadius: "20px",
      fontWeight: isActive ? 600 : 400,
      bgcolor: isActive ? "action.selected" : "transparent",
      color: isActive ? (isDark ? "white" : "black") : "text.primary",
      "&:hover": { bgcolor: "action.hover" },
    }}
  >
    {label}
  </Button>
);

interface ContentHeaderProps {
  title: string;
  onAddClick: () => void;
}

const ContentHeader: FC<ContentHeaderProps> = ({ title, onAddClick }) => (
  <Box sx={{
    display: "flex",
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: "space-between",
    alignItems: { xs: 'flex-start', md: 'center' },
    mb: 3,
    gap: { xs: 2, md: 0 }
  }}>
    <Typography variant="h6" fontWeight={600}>{title}</Typography>
    <Button
      variant="contained"
      sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" } }}
      startIcon={<Plus size={18} />}
      onClick={onAddClick}
    >
      Agregar
    </Button>
  </Box>
);

interface AddFormCardProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const AddFormCard: FC<AddFormCardProps> = ({ title, onClose, children, onSubmit }) => (
  <Card sx={{ mb: 3, borderRadius: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={1.2} alignItems="center">
          <Plus size={18} />
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<X size={16} />}
          sx={{ borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}
        >
          Cerrar
        </Button>
      </Box>
      <Box mt={2} />
      <Box component="form" onSubmit={onSubmit}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

export default function CampaxaChat() {
  const [activeMenu, setActiveMenu] = useState<"chatbot" | "campanas">("chatbot");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Chatbot state
  const [showAddChatbot, setShowAddChatbot] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [instancia, setInstancia] = useState("");
  const [paraTodos, setParaTodos] = useState(false);
  const [flujo, setFlujo] = useState("");
  const [rows, setRows] = useState<ChatbotRow[]>([]);
  const nextId = useMemo(() => (rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1), [rows]);
  const [editingChatbot, setEditingChatbot] = useState<ChatbotRow | null>(null);

  // Campañas state
  const [showAddCampana, setShowAddCampana] = useState(false);
  const [campanas, setCampanas] = useState<CampanaRow[]>([]);
  const nextCampanaId = useMemo(() => (campanas.length ? Math.max(...campanas.map(c => c.id)) + 1 : 1), [campanas]);
  const [campTitulo, setCampTitulo] = useState("");
  const [plantilla, setPlantilla] = useState("");
  const [agenda, setAgenda] = useState("");
  const [estado, setEstado] = useState("Inactivo"); // Default inactivo
  const [programar, setProgramar] = useState("");
  const [retrasoDesde, setRetrasoDesde] = useState("");
  const [retrasoHasta, setRetrasoHasta] = useState("");
  const [zonaHoraria, setZonaHoraria] = useState("");
  const [editingCampana, setEditingCampana] = useState<CampanaRow | null>(null);

  // Confirm Dialog state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<"chatbot" | "campana">("chatbot");

  // Reset forms
  const resetChatbotForm = () => {
    setTitulo(""); setInstancia(""); setParaTodos(false); setFlujo("");
    setEditingChatbot(null); setShowAddChatbot(false);
  };
  const resetCampanaForm = () => {
    setCampTitulo(""); setPlantilla(""); setAgenda(""); setEstado("Inactivo");
    setProgramar(""); setRetrasoDesde(""); setRetrasoHasta(""); setZonaHoraria("");
    setEditingCampana(null); setShowAddCampana(false);
  };

  // Add/Edit Handlers
  const handleAddChatbotClick = () => { resetChatbotForm(); setShowAddChatbot(true); };
  const handleEditChatbotClick = (chatbot: ChatbotRow) => {
    setEditingChatbot(chatbot);
    setTitulo(chatbot.titulo); setInstancia(chatbot.instancia);
    setParaTodos(chatbot.paraTodos); setFlujo(chatbot.flujo);
    setShowAddChatbot(true);
  };
  const handleAddCampanaClick = () => { resetCampanaForm(); setShowAddCampana(true); };
  const handleEditCampanaClick = (campana: CampanaRow) => {
    setEditingCampana(campana);
    setCampTitulo(campana.titulo); setPlantilla(campana.plantilla); setAgenda(campana.agenda);
    setEstado(campana.estado); setProgramar(campana.programar); setRetrasoDesde(campana.retrasoDesde);
    setRetrasoHasta(campana.retrasoHasta); setZonaHoraria(campana.zonaHoraria);
    setShowAddCampana(true);
  };

  // Submit Handlers
  const handleEnviarChatbot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !instancia || !flujo) return;
    if (editingChatbot) {
      setRows(prevRows => prevRows.map(row =>
        row.id === editingChatbot.id
          ? { ...editingChatbot, titulo, instancia, paraTodos, flujo }
          : row
      ));
    } else {
      const nuevo: ChatbotRow = { id: nextId, titulo, paraTodos, flujo, activo: false, instancia };
      setRows(prev => [...prev, nuevo]);
    }
    resetChatbotForm();
  };

  const handleEnviarCampana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitulo || !plantilla) return;
    if(editingCampana) {
      setCampanas(prev => prev.map(c => 
        c.id === editingCampana.id ? { ...editingCampana, titulo: campTitulo, plantilla, agenda, estado, programar, retrasoDesde, retrasoHasta, zonaHoraria } : c
      ));
    } else {
      const nueva: CampanaRow = { id: nextCampanaId, titulo: campTitulo, plantilla, agenda, estado, programar, retrasoDesde, retrasoHasta, zonaHoraria };
      setCampanas(prev => [...prev, nueva]);
    }
    resetCampanaForm();
  };

  // Toggle activo
  const handleToggleActivoChatbot = (id: number) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, activo: !r.activo } : r)));

  // Open confirm dialog
  const handleEliminar = (id: number, type: "chatbot" | "campana") => {
    setDeleteId(id);
    setDeleteType(type);
    setOpenConfirm(true);
  };

  // Sidebar content
  const sidebarContent = (
    <Box width="260px" bgcolor="background.paper" display="flex" flexDirection="column" alignItems="center" p={3} height="100%">
      <Box mb={2}>
        <img src={sendingImg} alt="Ilustración mujer" style={{ width: "160px", height: "160px", objectFit: "contain" }} />
      </Box>
      <Typography variant="body2" align="center" sx={{ mb: 3, color: "text.secondary" }}>
        Automatiza o transmite usando tu <br /> WhatsApp aquí y mucho más
      </Typography>
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <SidebarNavButton
          label="Chatbot"
          icon={<Home size={20} />}
          isActive={activeMenu === 'chatbot'}
          isDark={isDark}
          onClick={() => { setActiveMenu("chatbot"); if (isMobile) handleDrawerToggle(); }}
        />
        <SidebarNavButton
          label="Campañas"
          icon={<Radio size={20} />}
          isActive={activeMenu === 'campanas'}
          isDark={isDark}
          onClick={() => { setActiveMenu("campanas"); if (isMobile) handleDrawerToggle(); }}
        />
      </Box>
    </Box>
  );

  return (
    <Box display="flex" height="100vh" fontFamily="sans-serif">
      {!isMobile && sidebarContent}
      <Drawer variant="temporary" open={isMobile && mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        {sidebarContent}
      </Drawer>

      <Box flex={1} p={{ xs: 2, sm: 4 }} bgcolor="background.default" color="text.primary" sx={{ overflowY: 'auto', position: 'relative' }}>
        {isMobile && (
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mb: 2 }}>
            <Menu />
          </IconButton>
        )}

        {/* Chatbots */}
        {activeMenu === "chatbot" && (
          <div>
            <ContentHeader title="Agregar Chatbot" onAddClick={handleAddChatbotClick} />
            
            {showAddChatbot && (
              <AddFormCard title={editingChatbot ? "Editar chatbot" : "Agregar chatbot"} onClose={resetChatbotForm} onSubmit={handleEnviarChatbot}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" label="Título del chatbot" value={titulo} onChange={e => setTitulo(e.target.value)} /></Grid>
                  <Grid item xs={12} md={6}>
                    <Select fullWidth size="small" displayEmpty value={instancia} onChange={e => setInstancia(e.target.value)} renderValue={val => val || "Seleccionar instancia"}>
                      <MenuItem value="Angel">Angel</MenuItem>
                      <MenuItem value="Demo">Demo</MenuItem>
                      <MenuItem value="Producción">Producción</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}><FormControlLabel control={<Switch checked={paraTodos} onChange={e => setParaTodos(e.target.checked)} />} label="¿Para todos?"/></Grid>
                  <Grid item xs={12}>
                    <Select fullWidth size="small" displayEmpty value={flujo} onChange={e => setFlujo(e.target.value)} renderValue={val => val || "Seleccionar flujo"}>
                      <MenuItem value="Prueba">Prueba</MenuItem>
                      <MenuItem value="Soporte">Soporte</MenuItem>
                      <MenuItem value="Ventas">Ventas</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" startIcon={editingChatbot ? <Save size={16}/> : <Send size={16}/>} sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" }, borderRadius: 2 }}>
                        {editingChatbot ? "Guardar Cambios" : "Enviar"}
                    </Button>
                  </Grid>
                </Grid>
              </AddFormCard>
            )}

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Título</TableCell>
                          <TableCell>¿Para todos?</TableCell>
                          <TableCell>Título del flujo</TableCell>
                          <TableCell>Activo</TableCell>
                          <TableCell>Nombre de la instancia</TableCell>
                          <TableCell>Editar</TableCell>
                          <TableCell>Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow><TableCell colSpan={8} align="center">No hay chatbots</TableCell></TableRow>
                      ) : (
                        rows.map(row => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.titulo}</TableCell>
                            <TableCell>{row.paraTodos ? "Sí" : "No"}</TableCell>
                            <TableCell>{row.flujo}</TableCell>
                            <TableCell><Switch checked={row.activo} onChange={() => handleToggleActivoChatbot(row.id)} /></TableCell>
                            <TableCell>{row.instancia}</TableCell>
                            <TableCell><IconButton size="small" onClick={() => handleEditChatbotClick(row)}><Pencil size={16} /></IconButton></TableCell>
                            <TableCell><IconButton size="small" color="error" onClick={() => handleEliminar(row.id, "chatbot")}><Trash2 size={16} /></IconButton></TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Campañas */}
        {activeMenu === "campanas" && (
          <div>
            <ContentHeader title="Agregar Campaña" onAddClick={handleAddCampanaClick} />
            {showAddCampana && (
              <AddFormCard title={editingCampana ? "Editar campaña" : "Agregar campaña"} onClose={resetCampanaForm} onSubmit={handleEnviarCampana}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" label="Título de la campaña" value={campTitulo} onChange={e => setCampTitulo(e.target.value)}/></Grid>
                  <Grid item xs={12} md={6}>
                      <Select fullWidth size="small" displayEmpty value={plantilla} onChange={e => setPlantilla(e.target.value)} renderValue={val => val || "Seleccionar plantilla"}>
                          <MenuItem value="Bienvenida">Bienvenida</MenuItem>
                          <MenuItem value="Promo">Promo</MenuItem>
                          <MenuItem value="Recordatorio">Recordatorio</MenuItem>
                      </Select>
                  </Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" type="tel" label="Agenda telefónica" value={agenda} onChange={e => setAgenda(e.target.value)}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" type="datetime-local" label="Programar" value={programar} onChange={e => setProgramar(e.target.value)} InputLabelProps={{ shrink: true }}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" type="time" label="Retraso desde" value={retrasoDesde} onChange={e => setRetrasoDesde(e.target.value)} InputLabelProps={{ shrink: true }}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth size="small" type="time" label="Retraso hasta" value={retrasoHasta} onChange={e => setRetrasoHasta(e.target.value)} InputLabelProps={{ shrink: true }}/></Grid>
                  <Grid item xs={12} md={6}>
                      <Select fullWidth size="small" displayEmpty value={zonaHoraria} onChange={e => setZonaHoraria(e.target.value)} renderValue={val => val || "Seleccionar zona horaria"}>
                          <MenuItem value="America/Mexico_City">México</MenuItem>
                          <MenuItem value="America/Bogota">Colombia</MenuItem>
                          <MenuItem value="America/Lima">Perú</MenuItem>
                          <MenuItem value="Europe/Madrid">España</MenuItem>
                      </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch checked={estado === "Activo"} onChange={e => setEstado(e.target.checked ? "Activo" : "Inactivo")} />}
                      label="Activo"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" startIcon={editingCampana ? <Save size={16}/> : <Send size={16}/>} sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" }, borderRadius: 2 }}>
                        {editingCampana ? "Guardar Cambios" : "Enviar"}
                    </Button>
                  </Grid>
                </Grid>
              </AddFormCard>
            )}

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <TableContainer>
                        <Table sx={{ minWidth: 1000 }}>
                            <TableHead>
                              <TableRow>
                                  <TableCell>Título</TableCell>
                                  <TableCell>Plantilla</TableCell>
                                  <TableCell>Agenda</TableCell>
                                  <TableCell>Estado</TableCell>
                                  <TableCell>Programar</TableCell>
                                  <TableCell>Retraso desde</TableCell>
                                  <TableCell>Retraso hasta</TableCell>
                                  <TableCell>Zona horaria</TableCell>
                                  <TableCell>Editar</TableCell>
                                  <TableCell>Eliminar</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {campanas.length === 0 ? (
                                <TableRow><TableCell colSpan={10} align="center">No hay campañas</TableCell></TableRow>
                              ) : (
                                campanas.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.titulo}</TableCell>
                                        <TableCell>{c.plantilla}</TableCell>
                                        <TableCell>{c.agenda}</TableCell>
                                        <TableCell>{c.estado}</TableCell>
                                        <TableCell>{c.programar ? new Date(c.programar).toLocaleString("es-MX") : ""}</TableCell>
                                        <TableCell>{c.retrasoDesde}</TableCell>
                                        <TableCell>{c.retrasoHasta}</TableCell>
                                        <TableCell>{c.zonaHoraria}</TableCell>
                                        <TableCell><IconButton size="small" onClick={() => handleEditCampanaClick(c)}><Pencil size={16}/></IconButton></TableCell>
                                        <TableCell><IconButton size="small" color="error" onClick={() => handleEliminar(c.id, "campana")}><Trash2 size={16}/></IconButton></TableCell>
                                    </TableRow>
                                ))
                              )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
          </div>
        )}

        {/* Confirm Dialog */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>¿Seguro que quieres eliminar este {deleteType === "chatbot" ? "chatbot" : "campaña"}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
            <Button 
              color="error" 
              variant="contained" 
              onClick={() => {
                if (deleteId !== null) {
                  if (deleteType === "chatbot") setRows(prev => prev.filter(r => r.id !== deleteId));
                  else setCampanas(prev => prev.filter(c => c.id !== deleteId));
                }
                setOpenConfirm(false);
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
