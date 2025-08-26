import * as React from 'react'
import { Grid, Paper, Typography, Box, Button, Dialog, DialogContent } from '@mui/material'
import miFoto from '../images/foto.jpg'

const StatCard = ({ title, value, footer }: { title: string; value: string; footer?: string }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="overline" color="text.secondary">{title}</Typography>
    <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>{value}</Typography>
    {footer && <Typography variant="body2" color="text.secondary">{footer}</Typography>}
  </Paper>
)

export default function Dashboard() {
  // 👇 Estado para controlar si el modal está abierto o cerrado
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Usuarios" value="1,284" footer="+12 hoy" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Ventas" value="$23,900" footer="+8% semanal" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Tickets" value="73" footer="5 abiertos" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Tasa de error" value="0.34%" footer="-0.02% vs ayer" /></Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Bienvenidos Mortales</Typography>
            <Typography variant="body1" color="text.secondary">
              Esta es tu nueva plantilla base con React + Vite + Material UI. Te incluye layout con AppBar, Drawer,
              rutas con React Router y un ejemplo de CRUDsito simple en la sección de Usuarios. De nada son 20 peso.
            </Typography>
            {/* 👇 ahora abre el modal */}
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleOpen}>
              Acción rápida
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal con la imagen */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <img
            src={miFoto}
            alt="Imagen personalizada"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
