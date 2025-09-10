import React, { useState } from "react";
import { Home, Radio, Plus, Send, Pencil, Trash2, Menu } from "lucide-react";
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
  TableContainer,
  Drawer,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  estado: boolean;
  programar: string;
  retrasoDesde: string;
  retrasoHasta: string;
  zonaHoraria: string;
};

export default function CampaxaChat() {
  const [activeMenu, setActiveMenu] = useState<"chatbot" | "campanas">(
    "chatbot"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- Estado Chatbots ---
  const [showAddChatbot, setShowAddChatbot] = useState(false);
  const [rows, setRows] = useState<ChatbotRow[]>([]);
  const [titulo, setTitulo] = useState("");
  const [paraTodos, setParaTodos] = useState(false);
  const [flujo, setFlujo] = useState("");
  const [activo, setActivo] = useState(true);
  const [instancia, setInstancia] = useState("");
  const [editChatbot, setEditChatbot] = useState<ChatbotRow | null>(null);
  const [deleteChatbotId, setDeleteChatbotId] = useState<number | null>(null);

  // --- Estado Campañas ---
  const [showAddCampana, setShowAddCampana] = useState(false);
  const [campanas, setCampanas] = useState<CampanaRow[]>([]);
  const [campTitulo, setCampTitulo] = useState("");
  const [plantilla, setPlantilla] = useState("");
  const [agenda, setAgenda] = useState("");
  const [campanaActiva, setCampanaActiva] = useState(true);
  const [programar, setProgramar] = useState("");
  const [retrasoDesde, setRetrasoDesde] = useState("");
  const [retrasoHasta, setRetrasoHasta] = useState("");
  const [zonaHoraria, setZonaHoraria] = useState("America/Mexico_City");
  const [editCampana, setEditCampana] = useState<CampanaRow | null>(null);
  const [deleteCampanaId, setDeleteCampanaId] = useState<number | null>(null);

  // --- Handlers ---
  const handleEnviarChatbot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editChatbot) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editChatbot.id
            ? { ...r, titulo, paraTodos, flujo, activo, instancia }
            : r
        )
      );
      setEditChatbot(null);
    } else {
      setRows((prev) => [
        ...prev,
        { id: Date.now(), titulo, paraTodos, flujo, activo, instancia },
      ]);
    }
    setTitulo("");
    setParaTodos(false);
    setFlujo("");
    setActivo(true);
    setInstancia("");
    setShowAddChatbot(false);
  };

  const handleEnviarCampana = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCampana) {
      setCampanas((prev) =>
        prev.map((c) =>
          c.id === editCampana.id
            ? {
                ...c,
                titulo: campTitulo,
                plantilla,
                agenda,
                estado: campanaActiva,
                programar,
                retrasoDesde,
                retrasoHasta,
                zonaHoraria,
              }
            : c
        )
      );
      setEditCampana(null);
    } else {
      setCampanas((prev) => [
        ...prev,
        {
          id: Date.now(),
          titulo: campTitulo,
          plantilla,
          agenda,
          estado: campanaActiva,
          programar,
          retrasoDesde,
          retrasoHasta,
          zonaHoraria,
        },
      ]);
    }
    setCampTitulo("");
    setPlantilla("");
    setAgenda("");
    setCampanaActiva(true);
    setProgramar("");
    setRetrasoDesde("");
    setRetrasoHasta("");
    setZonaHoraria("America/Mexico_City");
    setShowAddCampana(false);
  };

  const drawerContent = (
    <Box p={2} width={isMobile ? 250 : 220}>
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src={sendingImg}
          alt="Logo"
          style={{ width: "80px", height: "auto" }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Button
        fullWidth
        startIcon={<Home size={18} />}
        sx={{
          justifyContent: "flex-start",
          mb: 1,
          bgcolor: activeMenu === "chatbot" ? "primary.main" : "transparent",
          color: activeMenu === "chatbot" ? "white" : "inherit",
        }}
        onClick={() => {
          setActiveMenu("chatbot");
          setMobileOpen(false);
        }}
      >
        Chatbot
      </Button>
      <Button
        fullWidth
        startIcon={<Radio size={18} />}
        sx={{
          justifyContent: "flex-start",
          mb: 1,
          bgcolor: activeMenu === "campanas" ? "primary.main" : "transparent",
          color: activeMenu === "campanas" ? "white" : "inherit",
        }}
        onClick={() => {
          setActiveMenu("campanas");
          setMobileOpen(false);
        }}
      >
        Campañas
      </Button>
    </Box>
  );

  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
      {isMobile ? (
        <>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ m: 1 }}>
            <Menu />
          </IconButton>
          <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Box>{drawerContent}</Box>
      )}
      <Box flexGrow={1} p={2}>
        <Typography variant="h5" mb={2} fontWeight={600}>
          {activeMenu === "chatbot" ? "Chatbot" : "Campañas"}
        </Typography>

        {activeMenu === "chatbot" && (
          <>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems={isMobile ? "stretch" : "center"}
              mb={3}
              gap={2}
            >
              <Typography variant="h6" fontWeight={600}>
                {editChatbot ? "Editar chatbot" : "Agregar chatbot"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setShowAddChatbot(true)}
              >
                Agregar
              </Button>
            </Box>

            {(showAddChatbot || editChatbot) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box component="form" onSubmit={handleEnviarChatbot}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Título"
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Select
                          fullWidth
                          size="small"
                          displayEmpty
                          value={instancia}
                          onChange={(e) => setInstancia(e.target.value)}
                        >
                          <MenuItem value="" disabled>
                            Seleccionar instancia
                          </MenuItem>
                          <MenuItem value="Instancia 1">Instancia 1</MenuItem>
                          <MenuItem value="Instancia 2">Instancia 2</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Flujo"
                          value={flujo}
                          onChange={(e) => setFlujo(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={paraTodos}
                              onChange={(e) => setParaTodos(e.target.checked)}
                            />
                          }
                          label="Para todos"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={activo}
                              onChange={(e) => setActivo(e.target.checked)}
                            />
                          }
                          label="Activo"
                        />
                      </Grid>

                      {/* Botones Cerrar y Enviar juntos */}
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          gap={2}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              setShowAddChatbot(false);
                              setEditChatbot(null);
                            }}
                          >
                            Cerrar
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Send size={16} />}
                          >
                            {editChatbot ? "Guardar cambios" : "Enviar"}
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
                <TableContainer>
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Instancia</TableCell>
                        <TableCell>Flujo</TableCell>
                        <TableCell>Para todos</TableCell>
                        <TableCell>Activo</TableCell>
                        <TableCell>Editar</TableCell>
                        <TableCell>Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.titulo}</TableCell>
                          <TableCell>{row.instancia}</TableCell>
                          <TableCell>{row.flujo}</TableCell>
                          <TableCell>{row.paraTodos ? "Sí" : "No"}</TableCell>
                          <TableCell>{row.activo ? "Sí" : "No"}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditChatbot(row);
                                setTitulo(row.titulo);
                                setInstancia(row.instancia);
                                setParaTodos(row.paraTodos);
                                setFlujo(row.flujo);
                                setActivo(row.activo);
                                setShowAddChatbot(true);
                              }}
                            >
                              <Pencil size={16} />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteChatbotId(row.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {activeMenu === "campanas" && (
          <>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems={isMobile ? "stretch" : "center"}
              mb={3}
              gap={2}
            >
              <Typography variant="h6" fontWeight={600}>
                {editCampana ? "Editar campaña" : "Agregar campaña"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setShowAddCampana(true)}
              >
                Agregar
              </Button>
            </Box>

            {(showAddCampana || editCampana) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box component="form" onSubmit={handleEnviarCampana}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Título"
                          value={campTitulo}
                          onChange={(e) => setCampTitulo(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Select
                          fullWidth
                          size="small"
                          value={plantilla}
                          onChange={(e) => setPlantilla(e.target.value)}
                          displayEmpty
                          renderValue={(val) => val || "Seleccionar plantilla"}
                        >
                          <MenuItem value="Bienvenida">Bienvenida</MenuItem>
                          <MenuItem value="Promo">Promo</MenuItem>
                          <MenuItem value="Recordatorio">Recordatorio</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Agenda"
                          value={agenda}
                          onChange={(e) => setAgenda(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="datetime-local"
                          label="Programar"
                          InputLabelProps={{ shrink: true }}
                          value={programar}
                          onChange={(e) => setProgramar(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="Retraso desde"
                          InputLabelProps={{ shrink: true }}
                          value={retrasoDesde}
                          onChange={(e) => setRetrasoDesde(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="Retraso hasta"
                          InputLabelProps={{ shrink: true }}
                          value={retrasoHasta}
                          onChange={(e) => setRetrasoHasta(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Select
                          fullWidth
                          size="small"
                          value={zonaHoraria}
                          onChange={(e) => setZonaHoraria(e.target.value)}
                          displayEmpty
                          renderValue={(val) =>
                            val || "Seleccionar zona horaria"
                          }
                        >
                          <MenuItem value="America/Mexico_City">
                            México
                          </MenuItem>
                          <MenuItem value="America/Bogota">Colombia</MenuItem>
                          <MenuItem value="America/Lima">Perú</MenuItem>
                          <MenuItem value="Europe/Madrid">España</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={campanaActiva}
                              onChange={(e) =>
                                setCampanaActiva(e.target.checked)
                              }
                            />
                          }
                          label="Activa"
                        />
                      </Grid>

                      {/* Botones Cerrar y Enviar juntos */}
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          gap={2}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              setShowAddCampana(false);
                              setEditCampana(null);
                            }}
                          >
                            Cerrar
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Send size={16} />}
                          >
                            {editCampana ? "Guardar cambios" : "Enviar"}
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
                <TableContainer>
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Plantilla</TableCell>
                        <TableCell>Agenda</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Programar</TableCell>
                        <TableCell>Retraso desde</TableCell>
                        <TableCell>Retraso hasta</TableCell>
                        <TableCell>Zona</TableCell>
                        <TableCell>Editar</TableCell>
                        <TableCell>Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campanas.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.titulo}</TableCell>
                          <TableCell>{c.plantilla}</TableCell>
                          <TableCell>{c.agenda}</TableCell>
                          <TableCell>
                            {c.estado ? "Activo" : "Inactivo"}
                          </TableCell>
                          <TableCell>
                            {c.programar
                              ? new Date(c.programar).toLocaleString()
                              : ""}
                          </TableCell>
                          <TableCell>{c.retrasoDesde}</TableCell>
                          <TableCell>{c.retrasoHasta}</TableCell>
                          <TableCell>{c.zonaHoraria}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setEditCampana(c);
                                setCampTitulo(c.titulo);
                                setPlantilla(c.plantilla);
                                setAgenda(c.agenda);
                                setCampanaActiva(c.estado);
                                setProgramar(c.programar);
                                setRetrasoDesde(c.retrasoDesde);
                                setRetrasoHasta(c.retrasoHasta);
                                setZonaHoraria(c.zonaHoraria);
                                setShowAddCampana(true);
                              }}
                              size="small"
                            >
                              <Pencil size={16} />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setDeleteCampanaId(c.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Dialog eliminar chatbot */}
        <Dialog
          open={deleteChatbotId !== null}
          onClose={() => setDeleteChatbotId(null)}
        >
          <DialogTitle>Eliminar chatbot</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Seguro que quieres eliminar este chatbot?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteChatbotId(null)}>Cancelar</Button>
            <Button
              color="error"
              onClick={() => {
                setRows((prev) =>
                  prev.filter((r) => r.id !== deleteChatbotId)
                );
                setDeleteChatbotId(null);
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog eliminar campaña */}
        <Dialog
          open={deleteCampanaId !== null}
          onClose={() => setDeleteCampanaId(null)}
        >
          <DialogTitle>Eliminar campaña</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Seguro que quieres eliminar esta campaña?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteCampanaId(null)}>Cancelar</Button>
            <Button
              color="error"
              onClick={() => {
                setCampanas((prev) =>
                  prev.filter((c) => c.id !== deleteCampanaId)
                );
                setDeleteCampanaId(null);
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