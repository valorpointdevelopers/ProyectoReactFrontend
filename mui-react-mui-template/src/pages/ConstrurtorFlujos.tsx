// src/pages/FlowBuilder.tsx
import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Divider,
  useTheme,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PollIcon from "@mui/icons-material/Poll";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Draggable from "react-draggable";
import flo from "../images/flo.svg";

type BlockType =
  | "Texto"
  | "Imagen"
  | "Documento"
  | "Audio"
  | "Video"
  | "Ubicación"
  | "Encuesta";

type Block = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  data?: any;
};

type Template = {
  id: string;
  title: string;
  type: string;
  blocks: Block[];
};

type Connection = {
  from: string; // id bloque origen
  fromPort: string; // id puerto dentro del bloque origen (ej. "opt-0" o "kw-1")
  to: string; // id bloque destino (entrada única)
};

const BLOCK_BASE_X = 220;
const BLOCK_BASE_Y = 100;
const BLOCK_SPACING_Y = 160;
const BLOCK_WIDTH = 260;

const FlowBuilder: React.FC = () => {
  const theme = useTheme();

  // --- Estados principales ---
  const [showTemplates, setShowTemplates] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const nextId = useRef(1);

  const [flows, setFlows] = useState<{ id: number; name: string }[]>([
    { id: 1, name: "Flujo de bienvenida" },
    { id: 2, name: "Flujo de soporte" },
    { id: 3, name: "Flujo de ventas" },
  ]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [zoom, setZoom] = useState(100);
  const [interactive, setInteractive] = useState(true);
  const zoomIn = () => setZoom((z) => Math.min(300, z + 10));
  const zoomOut = () => setZoom((z) => Math.max(10, z - 10));
  const fitView = () => setZoom(100);

  const [menuOpen, setMenuOpen] = useState(false);
  const [flowsDrawer, setFlowsDrawer] = useState(false);
  const toggleFlowsDrawer = () => setFlowsDrawer((p) => !p);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOption, setDialogOption] = useState<BlockType | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Form state
  const [textContent, setTextContent] = useState("");
  const [forAll, setForAll] = useState(false);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [claveInput, setClaveInput] = useState("");

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const [legend, setLegend] = useState<string>("");

  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  const [surveyQuestion, setSurveyQuestion] = useState("");
  const [surveyOptions, setSurveyOptions] = useState<string[]>(["", ""]);

  const optionDefs: { label: BlockType; icon: React.ReactNode }[] = useMemo(
    () => [
      { label: "Texto", icon: <TextFieldsIcon /> },
      { label: "Imagen", icon: <ImageIcon /> },
      { label: "Documento", icon: <DescriptionOutlinedIcon /> },
      { label: "Audio", icon: <AudiotrackIcon /> },
      { label: "Video", icon: <VideocamIcon /> },
      { label: "Ubicación", icon: <LocationOnIcon /> },
      { label: "Encuesta", icon: <PollIcon /> },
    ],
    []
  );

  const blockColors: Record<BlockType, string> = {
    Texto: "#4C8BF5",
    Imagen: "#E57373",
    Documento: "#8E24AA",
    Audio: "#FFB300",
    Video: "#26A69A",
    Ubicación: "#43A047",
    Encuesta: "#7E57C2",
  };

  const getIconForType = (t: BlockType) => {
    switch (t) {
      case "Texto":
        return <TextFieldsIcon fontSize="small" />;
      case "Imagen":
        return <ImageIcon fontSize="small" />;
      case "Documento":
        return <DescriptionOutlinedIcon fontSize="small" />;
      case "Audio":
        return <AudiotrackIcon fontSize="small" />;
      case "Video":
        return <VideocamIcon fontSize="small" />;
      case "Ubicación":
        return <LocationOnIcon fontSize="small" />;
      case "Encuesta":
        return <PollIcon fontSize="small" />;
      default:
        return <DescriptionIcon fontSize="small" />;
    }
  };

  // --- Conexiones y refs por puerto ---
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnection, setPendingConnection] = useState<{ from: string; fromPort: string } | null>(null);

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);

  // puerto de entrada (izquierda) por bloque
  const inputPortRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // puertos de salida (por opción/keyword) por bloque
  const optionPortRefs = useRef<Record<string, Record<string, HTMLDivElement | null>>>({});

  type Rect = { left: number; top: number; width: number; height: number };
  const [nodeRects, setNodeRects] = useState<Record<string, Rect>>({});
  const [inputPortRects, setInputPortRects] = useState<Record<string, Rect>>({});
  const [optionPortRects, setOptionPortRects] = useState<Record<string, Record<string, Rect>>>({});

  // --- computeRects: se reutiliza desde useLayoutEffect y ref callbacks ---
  const computeRects = () => {
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    const nmap: Record<string, Rect> = {};
    const inMap: Record<string, Rect> = {};
    const optMap: Record<string, Record<string, Rect>> = {};

    for (const b of blocks) {
      const el = nodeRefs.current[b.id];
      if (el) {
        const r = el.getBoundingClientRect();
        nmap[b.id] = { left: r.left - stageRect.left, top: r.top - stageRect.top, width: r.width, height: r.height };
      }

      const inEl = inputPortRefs.current[b.id];
      if (inEl) {
        const r = inEl.getBoundingClientRect();
        inMap[b.id] = { left: r.left - stageRect.left, top: r.top - stageRect.top, width: r.width, height: r.height };
      }

      const optRefs = optionPortRefs.current[b.id] || {};
      const keys = Object.keys(optRefs);
      if (keys.length) {
        optMap[b.id] = {};
        for (const k of keys) {
          const oEl = optRefs[k];
          if (!oEl) continue;
          const r = oEl.getBoundingClientRect();
          optMap[b.id][k] = { left: r.left - stageRect.left, top: r.top - stageRect.top, width: r.width, height: r.height };
        }
      }
    }

    setNodeRects(nmap);
    setInputPortRects(inMap);
    setOptionPortRects(optMap);
  };

  // recalcula cuando cambian blocks o zoom (o resize)
  useLayoutEffect(() => {
    computeRects();
    const onResize = () => computeRects();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, zoom]);

  // --- HELPERS / ACTIONS ---
  const handleNewFlow = () => {
    setShowTemplates(false);
    setTitle("Untitled");
    setBlocks([]);
    setSelectedFileName(null);
    setKeywords([]);
    setDialogOpen(false);
    setConnections([]);
    setPendingConnection(null);
  };

  const handleShowTemplates = () => setShowTemplates(true);

  const openDialogFor = (opt: BlockType) => {
    setEditingBlockId(null);
    setDialogOption(opt);
    setDialogOpen(true);

    // reset
    setTextContent("");
    setForAll(false);
    setKeywords([]);
    setClaveInput("");
    setSelectedFileName(null);
    setLat("");
    setLng("");
    setSurveyQuestion("");
    setSurveyOptions(["", ""]);
    setLegend("");
  };

  const openEditDialog = (block: Block) => {
    setEditingBlockId(block.id);
    setDialogOption(block.type);
    setDialogOpen(true);

    setTextContent(block.data?.text ?? "");
    setForAll(block.data?.forAll ?? false);
    setKeywords(Array.isArray(block.data?.keywords) ? [...block.data.keywords] : []);
    setClaveInput("");
    setSelectedFileName(block.data?.fileName ?? null);
    setLat(block.data?.lat ?? "");
    setLng(block.data?.lng ?? "");
    setLegend(block.data?.legend ?? "");
    setSurveyQuestion(block.data?.question ?? "");
    setSurveyOptions(Array.isArray(block.data?.options) && block.data.options.length > 0 ? [...block.data.options] : ["", ""]);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogOption(null);
    setEditingBlockId(null);
  };

  const addKeyword = () => {
    const k = claveInput.trim();
    if (!k) return;
    if (!keywords.includes(k)) setKeywords((p) => [...p, k]);
    setClaveInput("");
  };

  const removeKeyword = (kw: string) => setKeywords((p) => p.filter((x) => x !== kw));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFileName(f.name);
  };

  const triggerImagePicker = () => imageInputRef.current?.click();
  const triggerVideoPicker = () => videoInputRef.current?.click();
  const triggerAudioPicker = () => audioInputRef.current?.click();
  const triggerDocPicker = () => docInputRef.current?.click();

  const handleSurveyOptionChange = (index: number, value: string) => {
    setSurveyOptions((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };
  const addSurveyOption = () => setSurveyOptions((prev) => [...prev, ""]);

  const saveBlockAsTemplate = (block: Block) => {
    const id = `${Date.now()}`;
    const tpl: Template = {
      id,
      title: `${block.type} - plantila`,
      type: "Block",
      blocks: [block],
    };
    setTemplates((p) => [tpl, ...p]);
  };

  // Eliminar bloque + limpiar refs/rects
  const deleteBlock = (id: string) => {
    // limpiar refs
    delete inputPortRefs.current[id];
    delete optionPortRefs.current[id];
    delete nodeRefs.current[id];

    // limpiar rect states
    setInputPortRects((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setOptionPortRects((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setNodeRects((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // eliminar conexiones relacionadas
    setConnections((conns) => conns.filter((c) => c.from !== id && c.to !== id));

    // eliminar el bloque y reordenar verticalmente
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      const re = filtered.map((b, idx) => ({ ...b, x: BLOCK_BASE_X, y: BLOCK_BASE_Y + idx * BLOCK_SPACING_Y }));
      // recompute un tick después
      setTimeout(() => computeRects(), 20);
      return re;
    });
  };

  const addBlockFromDialog = () => {
    if (!dialogOption) return;

    const id = editingBlockId ?? `${Date.now()}_${nextId.current++}`;

    const data: any =
      dialogOption === "Texto"
        ? { text: textContent, forAll, keywords }
        : ["Imagen", "Video", "Audio", "Documento"].includes(dialogOption)
        ? { fileName: selectedFileName, legend, keywords }
        : dialogOption === "Ubicación"
        ? { lat: lat || null, lng: lng || null, keywords }
        : dialogOption === "Encuesta"
        ? { question: surveyQuestion, options: surveyOptions.filter(Boolean), keywords }
        : null;

    if (editingBlockId) {
      setBlocks((prev) => prev.map((b) => (b.id === editingBlockId ? { ...b, type: dialogOption, data } : b)));
      closeDialog();
      setTimeout(() => computeRects(), 20);
      return;
    }

    setBlocks((prev) => {
      const newBlock: Block = { id, type: dialogOption, x: BLOCK_BASE_X, y: BLOCK_BASE_Y + prev.length * BLOCK_SPACING_Y, data };
      const next = [...prev, newBlock];
      setTimeout(() => computeRects(), 20);
      return next;
    });

    closeDialog();
  };

  const handleSaveFlowAsTemplate = () => {
    const id = `${Date.now()}`;
    const tpl: Template = { id, title: title || `Flujo ${id}`, type: "Flow", blocks: blocks };
    setTemplates((p) => [tpl, ...p]);
    setFlows((p) => [{ id: Number(id.slice(-6)), name: tpl.title }, ...p]);
  };

  const handleDeleteTemplate = (id: string) => setTemplates((p) => p.filter((t) => t.id !== id));

  // --- CONEXIONES desde puerto de opción ---
  const startConnectionFromOption = (blockId: string, portId: string) => {
    setPendingConnection({ from: blockId, fromPort: portId });
  };

  const completeConnection = (targetId: string) => {
    if (pendingConnection && pendingConnection.from !== targetId) {
      setConnections((prev) => {
        if (prev.some((c) => c.from === pendingConnection.from && c.fromPort === pendingConnection.fromPort && c.to === targetId)) return prev;
        return [...prev, { from: pendingConnection.from, fromPort: pendingConnection.fromPort, to: targetId }];
      });
    }
    setPendingConnection(null);
  };

  // registrar ref de puerto de opción -> devuelve callback
  const registerOptionRef = (blockId: string, portId: string) => (el: HTMLDivElement | null) => {
    if (!optionPortRefs.current[blockId]) optionPortRefs.current[blockId] = {};
    optionPortRefs.current[blockId][portId] = el;
    // recalcular posiciones un tick después para asegurarnos que getBoundingClientRect sea correcto
    setTimeout(() => computeRects(), 20);
  };

  // Dibuja las conexiones con las rects de puertos
  const renderConnections = () => {
    const arr: React.ReactNode[] = [];
    for (let i = 0; i < connections.length; i++) {
      const c = connections[i];
      const fromR = optionPortRects[c.from]?.[c.fromPort];
      const toR = inputPortRects[c.to];
      if (!fromR || !toR) continue;

      const x1 = fromR.left + fromR.width / 2;
      const y1 = fromR.top + fromR.height / 2;
      const x2 = toR.left + toR.width / 2;
      const y2 = toR.top + toR.height / 2;

      const dx = Math.max(30, Math.abs(x2 - x1) / 2);
      const path = `M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      arr.push(<path key={i} d={path} stroke="#6b7280" strokeWidth={2} fill="none" markerEnd="url(#arrow)" />);
    }
    return arr;
  };

  // --- RENDER ---
  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 100px)", gap: 2 }}>
      {/* PANEL IZQUIERDO */}
      <Paper elevation={3} sx={{ width: 280, p: 2, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <Box component="img" src={flo} alt="Ilustración" sx={{ width: "85%", maxWidth: 190, mt: 1 }} />

        <Typography variant="body1" sx={{ textAlign: "center", fontWeight: 500 }}>
          Construya su flujo fácilmente utilizando el constructor de flujos potente
        </Typography>

        <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 1.5, py: 1.4 }} onClick={handleNewFlow}>
          Agregar nuevo flujo
        </Button>

        <Divider sx={{ width: "100%" }} />

        <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 1.5, py: 1.4 }} onClick={handleShowTemplates}>
          Guardado como plantilla
        </Button>
      </Paper>

      {/* Área principal */}
      <Box sx={{ flex: 1, position: "relative", borderRadius: 2, bgcolor: theme.palette.background.paper, overflow: "hidden" }}>
        {showTemplates ? (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DescriptionIcon />
              <Typography variant="h6">Lista de plantillas guardadas</Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table size="small" aria-label="Plantillas">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="center">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((tpl) => (
                    <TableRow key={tpl.id}>
                      <TableCell>{tpl.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DescriptionIcon fontSize="small" />
                          <Typography variant="body2">{tpl.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{tpl.type}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar plantilla" arrow>
                          <IconButton color="error" onClick={() => handleDeleteTemplate(tpl.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {templates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary">
                          No hay plantillas guardadas.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <>
            {/* GRID de fondo */}
            <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,100,100,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,100,0.12) 1px, transparent 1px)", backgroundSize: "20px 20px", zIndex: 0 }} />

            {/* Barra de título */}
            <Paper elevation={1} sx={{ position: "absolute", top: 12, left: 12, zIndex: 4, px: 2, py: 1, display: "flex", alignItems: "center", gap: 1, maxWidth: 540, borderRadius: 2 }}>
              <TextField value={title} onChange={(e) => setTitle(e.target.value)} variant="standard" sx={{ minWidth: 160, flex: 1 }} inputProps={{ "aria-label": "Título del flujo" }} />
              <Tooltip title="Guardar flujo como plantilla" arrow>
                <IconButton color="primary" onClick={handleSaveFlowAsTemplate}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Lista de flujos" arrow>
                <IconButton color="inherit" onClick={toggleFlowsDrawer}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </Paper>

            {/* Stage */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 1, p: 3, overflow: "auto" }}>
              <Box ref={stageRef} sx={{ position: "relative", width: "1600px", height: "1200px", transform: `scale(${zoom / 100})`, transformOrigin: "0 0", pointerEvents: interactive ? "auto" : "none" }}>
                {/* SVG para conexiones (debajo de nodos) */}
                <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                    </marker>
                  </defs>
                  {renderConnections()}
                </svg>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, position: "relative", zIndex: 2 }}>
                  {title}
                </Typography>

                {/* Bloques */}
                {blocks.map((b) => {
                  const keywordsList: string[] = Array.isArray(b.data?.keywords) ? b.data.keywords : [];
                  const surveyOpts: string[] = Array.isArray(b.data?.options) ? b.data.options : [];

                  return (
                    <Draggable
                      key={b.id}
                      position={{ x: b.x, y: b.y }}
                      onStop={(_, data) => {
                        setBlocks((prev) => prev.map((blk) => (blk.id === b.id ? { ...blk, x: data.x, y: data.y } : blk)));
                        // recalc rects un tick después
                        setTimeout(() => computeRects(), 20);
                      }}
                    >
                      <Paper
                        ref={(el: HTMLDivElement | null) => {
                          nodeRefs.current[b.id] = el;
                          setTimeout(() => computeRects(), 20);
                        }}
                        elevation={3}
                        sx={{ position: "absolute", left: 0, top: 0, width: BLOCK_WIDTH, borderRadius: 2, userSelect: "none", overflow: "hidden", boxShadow: 3, zIndex: 3 }}
                      >
                        {/* Pastilla superior */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.25, py: 0.6, bgcolor: blockColors[b.type] }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ color: "white", display: "flex", alignItems: "center" }}>{getIconForType(b.type)}</Box>
                            <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>{b.type}</Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Editar" arrow>
                              <IconButton size="small" onClick={() => openEditDialog(b)} sx={{ color: "white", bgcolor: "transparent" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Guardar como plantilla" arrow>
                              <IconButton size="small" onClick={() => saveBlockAsTemplate(b)} sx={{ color: "white", bgcolor: "transparent" }}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Eliminar" arrow>
                              <IconButton size="small" onClick={() => deleteBlock(b.id)} sx={{ color: "white", bgcolor: "transparent" }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>

                        {/* Contenido del bloque */}
                        <Box sx={{ px: 2, py: 1.25, bgcolor: "background.paper", position: "relative" }}>
                          {b.data?.legend && <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>{b.data.legend}</Typography>}

                          {b.type === "Texto" && (
                            <>
                              {b.data?.text ? (
                                <Typography variant="body2" sx={{ mb: 1 }}>{String(b.data.text).slice(0, 120)}{String(b.data.text).length > 120 ? "..." : ""}</Typography>
                              ) : (
                                <Typography variant="caption" color="text.secondary">Sin texto</Typography>
                              )}
                            </>
                          )}

                          {["Imagen", "Video", "Audio", "Documento"].includes(b.type) && (
                            <>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>{b.data?.fileName ?? "Archivo no seleccionado"}</Typography>
                              {b.data?.legend && <Typography variant="body2" sx={{ mb: 1 }}>{b.data.legend}</Typography>}
                            </>
                          )}

                          {b.type === "Ubicación" && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{b.data?.lat ? `lat: ${b.data.lat} lng: ${b.data.lng}` : "Sin coordenadas"}</Typography>}

                          {b.type === "Encuesta" && (
                            <>
                              <Typography variant="body2" sx={{ mb: 1 }}>{b.data?.question ?? "Sin pregunta"}</Typography>
                              <Stack spacing={0.5}>
                                {surveyOpts.map((opt: string, i: number) => {
                                  const portId = `opt-${i}`;
                                  return (
                                    <Box key={portId} sx={{ position: "relative" }}>
                                      <Button variant="outlined" size="small" fullWidth sx={{ justifyContent: "flex-start", textTransform: "none" }}>{opt}</Button>

                                      {/* Puerto por opción */}
                                      <Box ref={registerOptionRef(b.id, portId)} sx={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)" }}>
                                        <Tooltip title={pendingConnection?.from === b.id && pendingConnection?.fromPort === portId ? "Conexión iniciada" : "Conectar desde esta opción"} arrow>
                                          <IconButton size="small" onClick={() => startConnectionFromOption(b.id, portId)} sx={{ color: blockColors[b.type], bgcolor: "transparent" }}>
                                            <FiberManualRecordIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </>
                          )}

                          {/* keywords: ahora como renglones (botones full width) */}
                          {keywordsList.length > 0 && (
                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                              {keywordsList.map((k: string, i: number) => {
                                const portId = `kw-${i}`;
                                return (
                                  <Box key={portId} sx={{ position: "relative" }}>
                                    <Button variant="outlined" size="small" fullWidth sx={{ justifyContent: "flex-start", textTransform: "none", borderRadius: 2, bgcolor: "transparent", color: "text.primary" }}>
                                      {k}
                                    </Button>

                                    {/* Puerto por keyword */}
                                    <Box ref={registerOptionRef(b.id, portId)} sx={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)" }}>
                                      <Tooltip title={pendingConnection?.from === b.id && pendingConnection?.fromPort === portId ? "Conexión iniciada" : "Conectar desde esta clave"} arrow>
                                        <IconButton size="small" onClick={() => startConnectionFromOption(b.id, portId)} sx={{ color: blockColors[b.type], bgcolor: "transparent" }}>
                                          <FiberManualRecordIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Stack>
                          )}
                        </Box>

                        {/* Puerto de entrada (izquierda) */}
                        <Box
                          ref={(el: HTMLDivElement | null) => {
                            inputPortRefs.current[b.id] = el;
                            setTimeout(() => computeRects(), 20);
                          }}
                          sx={{ position: "absolute", left: -10, top: "50%", transform: "translateY(-50%)", zIndex: 5 }}
                        >
                          <Tooltip title="Aceptar conexión" arrow>
                            <IconButton size="small" onClick={() => completeConnection(b.id)} sx={{ bgcolor: pendingConnection && pendingConnection.from !== b.id ? "rgba(255,255,255,0.06)" : "transparent", color: "rgba(0,0,0,0.54)" }}>
                              <RadioButtonUncheckedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    </Draggable>
                  );
                })}
              </Box>
            </Box>

            {/* Controles inferiores izquierda */}
            <Box sx={{ position: "absolute", bottom: 16, left: 16, display: "flex", flexDirection: "column", gap: 1, zIndex: 6 }}>
              <Tooltip title="Zoom in" arrow>
                <IconButton color="primary" onClick={zoomIn} sx={{ bgcolor: "background.paper" }}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom out" arrow>
                <IconButton color="primary" onClick={zoomOut} sx={{ bgcolor: "background.paper" }}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fit view" arrow>
                <IconButton color="primary" onClick={fitView} sx={{ bgcolor: "background.paper" }}>
                  <FitScreenIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle interactive" arrow>
                <IconButton color="primary" onClick={() => setInteractive((p) => !p)} sx={{ bgcolor: "background.paper" }}>
                  {interactive ? <LockOpenIcon /> : <LockIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Menú flotante (+) */}
            <Box onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} sx={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, zIndex: 7 }}>
              {menuOpen &&
                optionDefs.map((opt, idx) => (
                  <Zoom in={menuOpen} key={opt.label} style={{ transitionDelay: `${idx * 50}ms` }}>
                    <Button variant="contained" color="primary" onClick={() => openDialogFor(opt.label)} startIcon={opt.icon} sx={{ borderRadius: "20px", justifyContent: "flex-start", minWidth: "170px", textTransform: "none", fontSize: "0.9rem", boxShadow: 3 }}>
                      {opt.label}
                    </Button>
                  </Zoom>
                ))}

              <Fab color="secondary" sx={{ boxShadow: 4 }} onClick={() => setMenuOpen((p) => !p)} aria-label="abrir opciones">
                {menuOpen ? <CloseIcon /> : <AddIcon />}
              </Fab>
            </Box>
          </>
        )}
      </Box>

      {/* Drawer derecho */}
      <Drawer anchor="right" open={flowsDrawer} onClose={toggleFlowsDrawer} sx={{ "& .MuiDrawer-paper": { width: 340, p: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <ListAltIcon />
          <Typography variant="h6">Lista de flujos</Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          {flows.map((flow) => (
            <ListItem key={flow.id} secondaryAction={<Tooltip title="Editar" arrow><IconButton edge="end" color="primary"><EditIcon /></IconButton></Tooltip>}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={flow.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogOption ? (
            <>
              {dialogOption === "Texto" && (editingBlockId ? "Editar mensaje de texto" : "Agregar mensaje de texto")}
              {dialogOption === "Imagen" && (editingBlockId ? "Editar mensaje de imagen" : "Agregar mensaje de imagen")}
              {dialogOption === "Video" && (editingBlockId ? "Editar mensaje de video" : "Agregar mensaje de video")}
              {dialogOption === "Audio" && (editingBlockId ? "Editar mensaje de audio" : "Agregar mensaje de audio")}
              {dialogOption === "Documento" && (editingBlockId ? "Editar mensaje de documento" : "Agregar mensaje de documento")}
              {dialogOption === "Ubicación" && (editingBlockId ? "Editar mensaje de ubicación" : "Agregar mensaje de ubicación")}
              {dialogOption === "Encuesta" && (editingBlockId ? "Editar encuesta" : "Mensaje de la encuesta")}
            </>
          ) : (
            "Agregar"
          )}
        </DialogTitle>

        <DialogContent dividers>
          {/* TEXTO */}
          {dialogOption === "Texto" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel control={<Switch checked={forAll} onChange={() => setForAll((p) => !p)} />} label="¿Para todos?" />
              <TextField multiline minRows={5} placeholder="Ingresar mensaje..." value={textContent} onChange={(e) => setTextContent(e.target.value)} fullWidth />
            </Box>
          )}

          {/* MULTIMEDIA */}
          {["Imagen", "Video", "Audio", "Documento"].includes(String(dialogOption)) && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Selecciona un archivo para {String(dialogOption).toLowerCase()}.</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" sx={{ textTransform: "none", bgcolor: theme.palette.action.hover, opacity: 0.95 }} onClick={() => { if (dialogOption === "Imagen") triggerImagePicker(); if (dialogOption === "Video") triggerVideoPicker(); if (dialogOption === "Audio") triggerAudioPicker(); if (dialogOption === "Documento") triggerDocPicker(); }}>
                  {dialogOption === "Imagen" ? "Subir imagen" : dialogOption === "Video" ? "Subir video" : dialogOption === "Audio" ? "Subir audio" : "Subir documento"}
                </Button>
                <Typography variant="caption" color="text.secondary">{selectedFileName ?? "Ningún archivo seleccionado"}</Typography>
              </Stack>
              <TextField label="Agregar leyenda (opcional)" placeholder="Leyenda..." value={legend} onChange={(e) => setLegend(e.target.value)} fullWidth multiline maxRows={3} />
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
              <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleFileChange} />
              <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={handleFileChange} />
            </Box>
          )}

          {/* UBICACIÓN */}
          {dialogOption === "Ubicación" && (
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField label="Latitud" value={lat} onChange={(e) => setLat(e.target.value)} fullWidth type="number" />
              <TextField label="Longitud" value={lng} onChange={(e) => setLng(e.target.value)} fullWidth type="number" />
            </Box>
          )}

          {/* ENCUESTA */}
          {dialogOption === "Encuesta" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Pregunta" value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)} fullWidth />
              <Box>
                <Typography variant="caption" color="text.secondary">Opciones de la encuesta</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {surveyOptions.map((opt, i) => <TextField key={i} value={opt} onChange={(e) => handleSurveyOptionChange(i, e.target.value)} size="small" placeholder={`Opción ${i + 1}`} />)}
                </Stack>
                <Button startIcon={<AddCircleIcon />} size="small" sx={{ mt: 1 }} onClick={addSurveyOption}>Agregar opción</Button>
              </Box>
            </Box>
          )}

          {/* CLAVES */}
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Typography variant="subtitle2">Claves de respuesta</Typography>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">{keywords.map((k) => <Chip key={k} label={k} onDelete={() => removeKeyword(k)} />)}</Stack>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField placeholder="Clave de respuesta" value={claveInput} onChange={(e) => setClaveInput(e.target.value)} fullWidth size="small" />
            <Tooltip title="Agregar clave" arrow>
              <IconButton color="primary" onClick={addKeyword} aria-label="agregar clave"><AddCircleIcon /></IconButton>
            </Tooltip>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button variant="contained" onClick={addBlockFromDialog} disabled={dialogOption === "Texto" ? textContent.trim().length === 0 : ["Imagen", "Video", "Audio", "Documento"].includes(String(dialogOption)) ? !selectedFileName : dialogOption === "Ubicación" ? !(lat && lng) : dialogOption === "Encuesta" ? surveyQuestion.trim().length === 0 || surveyOptions.filter(Boolean).length < 2 : false}>
            {editingBlockId ? "Guardar cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlowBuilder;