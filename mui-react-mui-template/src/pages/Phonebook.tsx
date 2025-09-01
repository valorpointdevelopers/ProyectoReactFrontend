import React from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Checkbox,
  Toolbar,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Stack
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import DownloadIcon from "@mui/icons-material/Download"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined"
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined"
import phonebookImg from "../images/contact.svg"

type Agenda = {
  id: string
  name: string
  createdAt: string
}

type Contact = {
  id: string
  agendaId: string
  contactName: string
  phone: string
  var1?: string
  var2?: string
  var3?: string
  var4?: string
  var5?: string
  date: string // ISO
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
const fmt = (dIso: string) => {
  const d = new Date(dIso)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const STORAGE_KEYS = {
  agendas: "pb_agendas",
  contacts: "pb_contacts",
}

const loadLS = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
const saveLS = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v))

// -------- Dialogo para agregar contactos (manual o CSV)
type AddContactDialogProps = {
  open: boolean
  agenda?: Agenda
  onClose: () => void
  onSubmitMany: (rows: Omit<Contact, "id" | "date">[]) => void
}
const AddContactDialog: React.FC<AddContactDialogProps> = ({ open, agenda, onClose, onSubmitMany }) => {
  const [tab, setTab] = React.useState<0 | 1>(0)
  const [contactName, setContactName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [vars, setVars] = React.useState({ var1: "", var2: "", var3: "", var4: "", var5: "" })
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setTab(0)
      setContactName("")
      setPhone("")
      setVars({ var1: "", var2: "", var3: "", var4: "", var5: "" })
      setError(null)
    }
  }, [open])

  const submitSingle = () => {
    if (!contactName.trim() || !phone.trim()) {
      setError("Nombre y número son obligatorios.")
      return
    }
    onSubmitMany([
      {
        agendaId: agenda!.id,
        contactName: contactName.trim(),
        phone: phone.trim(),
        ...vars,
      },
    ])
    onClose()
  }

  const onCSV = async (file: File) => {
    const text = await file.text()
    // CSV simple con cabeceras: name,phone,var1,var2,var3,var4,var5
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) {
      setError("El CSV no tiene datos.")
      return
    }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const idx = {
      name: headers.indexOf("name") !== -1 ? headers.indexOf("name") : headers.indexOf("nombre"),
      phone: headers.indexOf("phone") !== -1 ? headers.indexOf("phone") : headers.indexOf("numero"),
      var1: headers.indexOf("var1"),
      var2: headers.indexOf("var2"),
      var3: headers.indexOf("var3"),
      var4: headers.indexOf("var4"),
      var5: headers.indexOf("var5"),
    }
    if (idx.name === -1 || idx.phone === -1) {
      setError('El CSV debe incluir columnas "name" y "phone".')
      return
    }
    const out: Omit<Contact, "id" | "date">[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",")
      const n = (cols[idx.name] || "").trim()
      const p = (cols[idx.phone] || "").trim()
      if (!n || !p) continue
      out.push({
        agendaId: agenda!.id,
        contactName: n,
        phone: p,
        var1: idx.var1 === -1 ? "" : (cols[idx.var1] || "").trim(),
        var2: idx.var2 === -1 ? "" : (cols[idx.var2] || "").trim(),
        var3: idx.var3 === -1 ? "" : (cols[idx.var3] || "").trim(),
        var4: idx.var4 === -1 ? "" : (cols[idx.var4] || "").trim(),
        var5: idx.var5 === -1 ? "" : (cols[idx.var5] || "").trim(),
      })
    }
    if (!out.length) {
      setError("No se pudo leer ningún registro del CSV.")
      return
    }
    onSubmitMany(out)
    onClose()
  }

  const downloadTemplate = () => {
    const tpl = "name,phone,var1,var2,var3,var4,var5\n"
    const blob = new Blob([tpl], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla_contactos.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Agregando número {agenda ? `(${agenda.name})` : ""}</DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Escribiendo" />
          <Tab label="Por CSV" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField
              label="Nombre del contacto"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Número telefónico (agregue el código de país)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">+</InputAdornment> }}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField label="var1" value={vars.var1} onChange={e => setVars({ ...vars, var1: e.target.value })} fullWidth />
              <TextField label="var2" value={vars.var2} onChange={e => setVars({ ...vars, var2: e.target.value })} fullWidth />
              <TextField label="var3" value={vars.var3} onChange={e => setVars({ ...vars, var3: e.target.value })} fullWidth />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="var4" value={vars.var4} onChange={e => setVars({ ...vars, var4: e.target.value })} fullWidth />
              <TextField label="var5" value={vars.var5} onChange={e => setVars({ ...vars, var5: e.target.value })} fullWidth />
            </Stack>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <Typography variant="body2">
              Sube un CSV con cabeceras: <b>name, phone</b> (opcional: var1..var5).
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadTemplate}>
                Descargar plantilla
              </Button>
              <Button component="label" variant="contained" startIcon={<UploadFileOutlinedIcon />}>
                Seleccionar CSV
                <input
                  type="file"
                  hidden
                  accept=".csv,text/csv"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) onCSV(f)
                  }}
                />
              </Button>
            </Stack>
          </Stack>
        )}

        {!!error && (
          <Alert sx={{ mt: 2 }} severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {tab === 0 ? (
          <Button variant="contained" onClick={submitSingle}>
            ENVIAR
          </Button>
        ) : (
          <Button variant="outlined" onClick={onClose}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

// ---------------------- Página principal
const Phonebook: React.FC = () => {
  const [agendas, setAgendas] = React.useState<Agenda[]>(() => loadLS<Agenda[]>(STORAGE_KEYS.agendas, []))
  const [contacts, setContacts] = React.useState<Contact[]>(() => loadLS<Contact[]>(STORAGE_KEYS.contacts, []))

  const [newAgendaTitle, setNewAgendaTitle] = React.useState("")
  const [snack, setSnack] = React.useState<{ open: boolean; msg: string; sev: "success" | "error" }>({
    open: false,
    msg: "",
    sev: "success",
  })

  const [selectedAgenda, setSelectedAgenda] = React.useState<Agenda | undefined>(undefined)
  const [openAddDialog, setOpenAddDialog] = React.useState(false)

  const [renameTarget, setRenameTarget] = React.useState<Agenda | undefined>(undefined)
  const [renameValue, setRenameValue] = React.useState("")

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(null)

  // --- selección de contactos
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const isSelected = (id: string) => selectedIds.has(id)
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const clearSelection = () => setSelectedIds(new Set())

  React.useEffect(() => saveLS(STORAGE_KEYS.agendas, agendas), [agendas])
  React.useEffect(() => saveLS(STORAGE_KEYS.contacts, contacts), [contacts])

  // ---- Agregar agenda
  const addAgenda = () => {
    if (!newAgendaTitle.trim()) {
      setSnack({ open: true, msg: "Escribe un título para la agenda.", sev: "error" })
      return
    }
    const ag: Agenda = { id: uid(), name: newAgendaTitle.trim(), createdAt: new Date().toISOString() }
    setAgendas(prev => [ag, ...prev])
    setNewAgendaTitle("")
    setSnack({ open: true, msg: "Agenda agregada.", sev: "success" })
  }

  // ---- Abrir diálogo agregar contacto
  const openAddContact = (agenda: Agenda) => {
    setSelectedAgenda(agenda)
    setOpenAddDialog(true)
  }

  const handleSubmitManyContacts = (rows: Omit<Contact, "id" | "date">[]) => {
    const now = new Date().toISOString()
    const toAdd: Contact[] = rows.map(r => ({ id: uid(), date: now, ...r }))
    setContacts(prev => [...toAdd, ...prev])
    setSnack({ open: true, msg: `Se agregaron ${toAdd.length} contacto(s).`, sev: "success" })
  }

  // ---- Editar agenda
  const startRename = (agenda: Agenda) => {
    setRenameTarget(agenda)
    setRenameValue(agenda.name)
  }
  const applyRename = () => {
    if (!renameTarget) return
    if (!renameValue.trim()) {
      setSnack({ open: true, msg: "El nombre no puede estar vacío.", sev: "error" })
      return
    }
    setAgendas(prev => prev.map(a => (a.id === renameTarget.id ? { ...a, name: renameValue.trim() } : a)))
    setRenameTarget(undefined)
    setSnack({ open: true, msg: "Agenda actualizada.", sev: "success" })
  }

  // ---- Borrar agenda y sus contactos
  const removeAgenda = (agenda: Agenda) => {
    if (!confirm(`¿Eliminar la agenda "${agenda.name}" y todos sus contactos?`)) return
    setAgendas(prev => prev.filter(a => a.id !== agenda.id))
    setContacts(prev => prev.filter(c => c.agendaId !== agenda.id))
    setSnack({ open: true, msg: "Agenda eliminada.", sev: "success" })
    clearSelection()
  }

  // ---- Exportar CSV
  const exportCSV = () => {
    const rows = contacts.map(c => ({
      agenda: agendas.find(a => a.id === c.agendaId)?.name || "",
      name: c.contactName,
      phone: c.phone,
      var1: c.var1 || "",
      var2: c.var2 || "",
      var3: c.var3 || "",
      var4: c.var4 || "",
      var5: c.var5 || "",
      date: fmt(c.date),
    }))
    const header = Object.keys(rows[0] || { agenda: "", name: "", phone: "", var1: "", var2: "", var3: "", var4: "", var5: "", date: "" })
    const csv = [header.join(","), ...rows.map(r => header.map(h => `"${(r as any)[h]?.toString().replace(/"/g, '""') || ""}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contactos.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---- Imprimir tabla (sólo el contenido)
  const printTable = () => {
    const table = document.getElementById("contacts-table")
    if (!table) return window.print()
    const html = `
      <html>
        <head>
          <title>Lista de contactos</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Lista de contactos</h2>
          ${table.outerHTML}
        </body>
      </html>`
    const w = window.open("", "_blank", "width=1200,height=800")
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const rows = contacts
  const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // ---- selección en cabecera (página)
  const allOnPageSelected = paged.length > 0 && paged.every(r => selectedIds.has(r.id))
  const someOnPageSelected = paged.some(r => selectedIds.has(r.id)) && !allOnPageSelected
  const toggleSelectAllOnPage = (checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      paged.forEach(r => {
        if (checked) next.add(r.id)
        else next.delete(r.id)
      })
      return next
    })
  }

  // ---- eliminar seleccionados
  const deleteSelected = () => {
    if (selectedIds.size === 0) return
    if (!confirm("¿Eliminar los contactos seleccionados?")) return
    setContacts(prev => prev.filter(c => !selectedIds.has(c.id)))
    clearSelection()
    setSnack({ open: true, msg: "Contactos eliminados.", sev: "success" })
    // Ajustar página si quedó fuera de rango
    const newTotal = rows.length - selectedIds.size
    const maxPage = Math.max(0, Math.ceil(newTotal / rowsPerPage) - 1)
    if (page > maxPage) setPage(maxPage)
  }

  return (
    <Box display="flex" gap={3} sx={{ height: "100vh" }}>
      {/* Panel lateral izquierdo */}
      <Card
        sx={{
          width: 260,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          p: 2,
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={phonebookImg}
            alt="Agenda telefónica"
            sx={{ width: "100%", height: "auto", borderRadius: 2, mb: 2 }}
          />
          <Typography variant="h6" align="center">
            Agenda telefónica
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Administrar agenda telefónica
          </Button>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      <Box flex={1} display="flex" flexDirection="column" gap={2} sx={{ height: "100%" }}>
        {/* Sección 1: Agregar agenda */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Agregar agenda telefónica
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Ingrese título de la agenda telefónica"
                value={newAgendaTitle}
                onChange={e => setNewAgendaTitle(e.target.value)}
                fullWidth
              />
              <Button variant="contained" color="primary" onClick={addAgenda}>
                Agregar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Sección 2: Lista de agendas */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Lista de agendas telefónicas
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {agendas.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Aún no hay agendas.
                </Typography>
              )}

              {agendas.map(ag => (
                <Box
                  key={ag.id}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    px: 1,
                    py: 0.5,
                    border: theme => `1px solid ${theme.palette.divider}`,
                    gap: 0.5,
                  }}
                >
                  <Chip
                    label={ag.name}
                    variant="outlined"
                    onClick={() => setSelectedAgenda(ag)}
                    sx={{ border: 0, "& .MuiChip-label": { px: 1 } }}
                  />
                  <IconButton size="small" onClick={() => openAddContact(ag)} title="Agregar número">
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => startRename(ag)} title="Editar nombre">
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => removeAgenda(ag)} title="Eliminar agenda">
                    <CloseOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Sección 3: Lista de contactos */}
        <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="subtitle1">
              Lista de contactos {selectedIds.size > 0 ? `(${selectedIds.size} seleccionados)` : ""}
            </Typography>
            <div>
              <Button
                startIcon={<DownloadIcon />}
                onClick={e => setExportAnchor(e.currentTarget)}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                EXPORT
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                variant="outlined"
                disabled={selectedIds.size === 0}
                onClick={deleteSelected}
              >
                Eliminar
              </Button>
              <Menu
                open={Boolean(exportAnchor)}
                anchorEl={exportAnchor}
                onClose={() => setExportAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    setExportAnchor(null)
                    exportCSV()
                  }}
                >
                  Descargar CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setExportAnchor(null)
                    printTable()
                  }}
                >
                  Imprimir
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
          <Divider />

          <Box flex={1} display="flex" flexDirection="column">
            <TableContainer component={Paper} sx={{ flex: 1 }}>
              <Table id="contacts-table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allOnPageSelected}
                        indeterminate={someOnPageSelected}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleSelectAllOnPage(e.target.checked)}
                        inputProps={{ "aria-label": "Seleccionar todos" }}
                      />
                    </TableCell>
                    <TableCell>Actualizar</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Agenda telefónica</TableCell>
                    <TableCell>Número de móvil</TableCell>
                    <TableCell>var1</TableCell>
                    <TableCell>var2</TableCell>
                    <TableCell>var3</TableCell>
                    <TableCell>var4</TableCell>
                    <TableCell>var5</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        No rows
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map(row => {
                      const agendaName = agendas.find(a => a.id === row.agendaId)?.name ?? "-"
                      const checked = isSelected(row.id)
                      return (
                        <TableRow key={row.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={checked}
                              onChange={() => toggleSelect(row.id)}
                              inputProps={{ "aria-label": `Seleccionar ${row.contactName}` }}
                            />
                          </TableCell>
                          <TableCell>
                            {/* Placeholder de acción "Actualizar" si luego conectas con backend */}
                            <IconButton size="small" title="Actualizar">
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>{row.contactName}</TableCell>
                          <TableCell>{agendaName}</TableCell>
                          <TableCell>+{row.phone}</TableCell>
                          <TableCell>{row.var1}</TableCell>
                          <TableCell>{row.var2}</TableCell>
                          <TableCell>{row.var3}</TableCell>
                          <TableCell>{row.var4}</TableCell>
                          <TableCell>{row.var5}</TableCell>
                          <TableCell>{fmt(row.date)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </Box>
        </Card>
      </Box>

      {/* Dialogos */}
      <AddContactDialog
        open={openAddDialog}
        agenda={selectedAgenda}
        onClose={() => setOpenAddDialog(false)}
        onSubmitMany={handleSubmitManyContacts}
      />

      <Dialog open={!!renameTarget} onClose={() => setRenameTarget(undefined)}>
        <DialogTitle>Renombrar agenda</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            label="Nuevo nombre"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameTarget(undefined)}>Cancelar</Button>
          <Button variant="contained" onClick={applyRename}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Phonebook
