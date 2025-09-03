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
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import chatsImage from "../images/chats.png";

interface Message {
  id: string;
  text: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CalentadorWhatsapp = () => {
  const [messages, setMessages] = useState<Message[]>([
  ]);

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleDeleteMessage = (id: string) => {
    const newMessages = messages.filter((msg) => msg.id !== id);
    setMessages(newMessages);
    setEditingId(null);
    setSaveStatus("idle");
  };

  const handleSaveScript = async () => {
    const hasEmptyMessage = messages.some((msg) => msg.text.trim() === "");
    if (hasEmptyMessage) {
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Saving messages:", messages);
      setSaveStatus("success");
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 3,
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        gap: 4,
      }}
    >

      <Box
        sx={{
          width: "300px",
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
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Calentar su WhatsApp antes de enviar una campaña o mensaje de texto con el Calentador es la mejor manera de reducir el riesgo de ser baneado.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 2 }}>
          Agregar mensajes de script de calentamiento
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Paper
          elevation={2}
          sx={{
            p: 3,
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
              error={saveStatus === "error" && message.text.trim() === ""}
              helperText={
                saveStatus === "error" && message.text.trim() === ""
                  ? "El mensaje no puede estar vacío"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {editingId === message.id ? (
                      <IconButton
                        edge="end"
                        color="success"
                        onClick={() => setEditingId(null)}
                        aria-label="finish editing"
                      >
                        <DoneIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => setEditingId(message.id)}
                        aria-label="edit message"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDeleteMessage(message.id)}
                      aria-label="delete message"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddMessage}
            >
              Añadir Mensaje
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSaveScript}
              disabled={isSaving || editingId !== null}
            >
              {isSaving ? "Guardando..." : "ENVIAR MENSAJE"}
            </Button>
          </Box>
        </Paper>

        {saveStatus === "success" && (
          <Alert severity="success" sx={{ mt: 3 }}>
            ¡Script guardado exitosamente!
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default CalentadorWhatsapp;