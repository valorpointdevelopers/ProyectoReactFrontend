import React, { useMemo, useState } from "react";
import { Home, Radio, Plus, X, Send, Pencil, Trash2, Eye } from "lucide-react";
import sendingImg from "../images/sending.svg";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";

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

export default function CampaxaChat() {
  // Menú activo (lado izquierdo)
  const [activeMenu, setActiveMenu] = useState<"chatbot" | "campanas">("chatbot");

  // --- Estado "Agregar chatbot" ---
  const [showAddChatbot, setShowAddChatbot] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [instancia, setInstancia] = useState("");
  const [paraTodos, setParaTodos] = useState(false);
  const [flujo, setFlujo] = useState("");
  const [rows, setRows] = useState<ChatbotRow[]>([]);
  const nextId = useMemo(() => (rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1), [rows]);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !instancia || !flujo) return;
    const nuevo: ChatbotRow = { id: nextId, titulo, paraTodos, flujo, activo: false, instancia };
    setRows(prev => [...prev, nuevo]);
    setTitulo(""); setInstancia(""); setParaTodos(false); setFlujo("");
  };

  const handleEliminar = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  const handleToggleActivo = (id: number) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, activo: !r.activo } : r)));

  // --- Estado "Agregar campaña" ---
  const [showAddCampana, setShowAddCampana] = useState(false);
  const [campanas, setCampanas] = useState<CampanaRow[]>([]);
  const nextCampanaId = useMemo(
    () => (campanas.length ? Math.max(...campanas.map(r => r.id)) + 1 : 1),
    [campanas]
  );

  const [campTitulo, setCampTitulo] = useState("");
  const [plantilla, setPlantilla] = useState("");
  const [agenda, setAgenda] = useState("");
  const [estado, setEstado] = useState("");
  const [programar, setProgramar] = useState("");
  const [retrasoDesde, setRetrasoDesde] = useState("");
  const [retrasoHasta, setRetrasoHasta] = useState("");
  const [zonaHoraria, setZonaHoraria] = useState("");

  const handleEnviarCampana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitulo || !plantilla) return;

    const nueva: CampanaRow = {
      id: nextCampanaId,
      titulo: campTitulo,
      plantilla,
      agenda,
      estado,
      programar,
      retrasoDesde,
      retrasoHasta,
      zonaHoraria,
    };
    setCampanas(prev => [...prev, nueva]);

    // limpiar
    setCampTitulo(""); setPlantilla(""); setAgenda(""); setEstado("");
    setProgramar(""); setRetrasoDesde(""); setRetrasoHasta(""); setZonaHoraria("");
  };

  const handleEliminarCampana = (id: number) =>
    setCampanas(prev => prev.filter(r => r.id !== id));

  return (
    <Box display="flex" height="100vh" fontFamily="sans-serif">
      {/* Sidebar */}
      <Box
        width="260px"
        bgcolor="background.paper"
        borderRight={1}
        borderColor="divider"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={3}
      >
        <Box mb={2}>
          <img src={sendingImg} alt="Ilustración mujer" style={{ width: "160px", height: "160px", objectFit: "contain" }} />
        </Box>
        <Typography variant="body2" align="center" sx={{ mb: 3, color: "text.secondary" }}>
          Automatiza o transmite usando tu <br /> WhatsApp aquí y mucho más
        </Typography>
        <Box display="flex" flexDirection="column" gap={1} width="100%">
          <Button
            startIcon={<Home size={20} />}
            sx={{
              justifyContent: "flex-start",
              borderRadius: "20px",
              fontWeight: activeMenu === "chatbot" ? 600 : 400,
              bgcolor: activeMenu === "chatbot" ? "action.selected" : "transparent",
              color: activeMenu === "chatbot" ? "black" : "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => setActiveMenu("chatbot")}
          >
            Chatbot
          </Button>
          <Button
            startIcon={<Radio size={20} />}
            sx={{
              justifyContent: "flex-start",
              borderRadius: "20px",
              fontWeight: activeMenu === "campanas" ? 600 : 400,
              bgcolor: activeMenu === "campanas" ? "action.selected" : "transparent",
              color: activeMenu === "campanas" ? "black" : "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => setActiveMenu("campanas")}
          >
            Campañas
          </Button>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box flex={1} p={4} bgcolor="background.default" color="text.primary">
        {activeMenu === "chatbot" && (
          <>
            {/* Chatbot */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>Agregar chatbot</Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" } }}
                startIcon={<Plus size={18} />}
                onClick={() => setShowAddChatbot(true)}
              >
                Agregar
              </Button>
            </Box>

            {showAddChatbot && (
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1.2} alignItems="center">
                      <Plus size={18} />
                      <Typography variant="h6" fontWeight={700}>Agregar chatbot</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAddChatbot(false)}
                      startIcon={<X size={16} />}
                      sx={{ borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}
                    >
                      Cerrar
                    </Button>
                  </Box>

                  <Box mt={2} />
                  <Box component="form" onSubmit={handleEnviar}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Título del chatbot" value={titulo} onChange={e => setTitulo(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Select
                          fullWidth size="small" displayEmpty value={instancia}
                          onChange={e => setInstancia(e.target.value as string)}
                          renderValue={val => (val ? val : "Seleccionar instancia")}
                        >
                          <MenuItem value={"Angel"}>Angel</MenuItem>
                          <MenuItem value={"Demo"}>Demo</MenuItem>
                          <MenuItem value={"Producción"}>Producción</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel control={<Switch checked={paraTodos} onChange={e => setParaTodos(e.target.checked)} />} label="¿Para todos?" />
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          fullWidth size="small" displayEmpty value={flujo}
                          onChange={e => setFlujo(e.target.value as string)}
                          renderValue={val => (val ? val : "Seleccionar flujo")}
                        >
                          <MenuItem value={"Prueba"}>Prueba</MenuItem>
                          <MenuItem value={"Soporte"}>Soporte</MenuItem>
                          <MenuItem value={"Ventas"}>Ventas</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" startIcon={<Send size={16} />} sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" }, borderRadius: 2 }}>
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Tabla chatbots */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Table>
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
                      <TableRow><TableCell colSpan={8} align="center">No rows</TableCell></TableRow>
                    ) : (
                      rows.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.titulo}</TableCell>
                          <TableCell>{row.paraTodos ? "Sí" : "No"}</TableCell>
                          <TableCell>{row.flujo}</TableCell>
                          <TableCell><Switch checked={row.activo} onChange={() => handleToggleActivo(row.id)} /></TableCell>
                          <TableCell>{row.instancia}</TableCell>
                          <TableCell><IconButton size="small"><Pencil size={16} /></IconButton></TableCell>
                          <TableCell><IconButton size="small" color="error" onClick={() => handleEliminar(row.id)}><Trash2 size={16} /></IconButton></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" fontSize="12px" color="text.secondary">
                  <span>Rows per page: 100</span>
                  <span>0–0 of {rows.length}</span>
                  <Box display="flex" gap={1}><Button size="small">{`<`}</Button><Button size="small">{`>`}</Button></Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}

        {activeMenu === "campanas" && (
          <>
            {/* Campañas */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>Agregar campaña</Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" } }}
                startIcon={<Plus size={18} />}
                onClick={() => setShowAddCampana(true)}
              >
                Agregar
              </Button>
            </Box>

            {showAddCampana && (
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1.2} alignItems="center">
                      <Plus size={18} />
                      <Typography variant="h6" fontWeight={700}>Agregar campaña</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAddCampana(false)}
                      startIcon={<X size={16} />}
                      sx={{ borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}
                    >
                      Cerrar
                    </Button>
                  </Box>

                  <Box mt={2} />
                  <Box component="form" onSubmit={handleEnviarCampana}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Título de la campaña" value={campTitulo} onChange={e => setCampTitulo(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Plantilla" value={plantilla} onChange={e => setPlantilla(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Agenda telefónica" value={agenda} onChange={e => setAgenda(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Estado" value={estado} onChange={e => setEstado(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Programar" value={programar} onChange={e => setProgramar(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Retraso desde" value={retrasoDesde} onChange={e => setRetrasoDesde(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Retraso hasta" value={retrasoHasta} onChange={e => setRetrasoHasta(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Zona horaria" value={zonaHoraria} onChange={e => setZonaHoraria(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" startIcon={<Send size={16} />} sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" }, borderRadius: 2 }}>
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Tabla campañas */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Plantilla</TableCell>
                      <TableCell>Agenda telefónica</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Programar</TableCell>
                      <TableCell>Retraso desde</TableCell>
                      <TableCell>Retraso hasta</TableCell>
                      <TableCell>Zona horaria</TableCell>
                      <TableCell>Ver</TableCell>
                      <TableCell>Eliminar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campanas.length === 0 ? (
                      <TableRow><TableCell colSpan={10} align="center">No rows</TableCell></TableRow>
                    ) : (
                      campanas.map(c => (
                        <TableRow key={c.id}>
                          <TableCell>{c.titulo}</TableCell>
                          <TableCell>{c.plantilla}</TableCell>
                          <TableCell>{c.agenda}</TableCell>
                          <TableCell>{c.estado}</TableCell>
                          <TableCell>{c.programar}</TableCell>
                          <TableCell>{c.retrasoDesde}</TableCell>
                          <TableCell>{c.retrasoHasta}</TableCell>
                          <TableCell>{c.zonaHoraria}</TableCell>
                          <TableCell><IconButton size="small"><Eye size={16} /></IconButton></TableCell>
                          <TableCell><IconButton size="small" color="error" onClick={() => handleEliminarCampana(c.id)}><Trash2 size={16} /></IconButton></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" fontSize="12px" color="text.secondary">
                  <span>Rows per page: 100</span>
                  <span>0–0 of {campanas.length}</span>
                  <Box display="flex" gap={1}><Button size="small">{`<`}</Button><Button size="small">{`>`}</Button></Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}
