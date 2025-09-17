import * as React from "react";
import config from "../config";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import QrWhatsapp from "./QrWhatsapp";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { rgba } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface MonthlyData {
  month: string;
  numberOfOders: number;
}

interface DashboardData {
  success: boolean;
  opened: MonthlyData[];
  pending: MonthlyData[];
  resolved: MonthlyData[];
  activeBot: MonthlyData[];
  dActiveBot: MonthlyData[];
  totalChats: number;
  totalChatbots: number;
  totalContacts: number;
  totalFlows: number;
  totalBroadcast: number;
  totalTemplets: number;
}

const PanelControl: React.FC = () => {
  const theme = useTheme();
  const [openQR, setOpenQR] = React.useState(true);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(config.API_URL + "/user/get_dashboard", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error al obtener datos:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const activityChartData = dashboardData ? {
    labels: dashboardData.opened.map((item) => item.month),
    datasets: [
      {
        label: 'Abierto',
        data: dashboardData.opened.map((item) => item.numberOfOders),
        borderColor: 'rgba(0, 164, 38, 1)',
        backgroundColor: 'rgba(0, 164, 38, 0.4)',
        fill: true,
      },
      {
        label: 'Pendiente',
        data: dashboardData.pending.map((item) => item.numberOfOders),
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        fill: true,
      },
      {
        label: 'Resuelto',
        data: dashboardData.resolved.map((item) => item.numberOfOders),
        borderColor: 'rgba(0, 119, 255, 1)',
        backgroundColor: 'rgba(0, 119, 255, 0.4)',
        fill: true,
      },
    ],
  } : null;

  const additionalMetricsChartData = dashboardData ? {
    labels: dashboardData.activeBot.map((item) => item.month),
    datasets: [
      {
        label: 'Bots Activos',
        data: dashboardData.activeBot.map((item) => item.numberOfOders),
        borderColor: 'rgba(199, 176, 5, 1)',
        backgroundColor: 'rgba(199, 176, 5, 0.4)',
        fill: true,
      },
      {
        label: 'Bots Desactivados',
        data: dashboardData.dActiveBot.map((item) => item.numberOfOders),
        borderColor: 'rgba(0, 143, 105, 0.99)',
        backgroundColor: 'rgba(0, 143, 105, 0.4)',
        fill: true,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      datalabels: {
        display: true,
        color: theme.palette.text.primary,
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        align: 'end' as const,
        anchor: 'end' as const,
        formatter: (value: any) => value > 0 ? value : '',
      },
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Error al cargar los datos: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 4, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
        Panel de Control
      </Typography>
      <Divider sx={{ mb: 4, bgcolor: theme.palette.divider }} />
      <QrWhatsapp open={openQR} onClose={() => setOpenQR(false)} />

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom>Actividad de Chats</Typography>
            <Box sx={{ width: '100%', height: 'calc(100vh - 400px)' }}>
              {activityChartData && <Line options={chartOptions} data={activityChartData} />}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom>Métricas Adicionales</Typography>
            <Box sx={{ width: '100%', minHeight: '300px' }}>
              {additionalMetricsChartData && <Line options={chartOptions} data={additionalMetricsChartData} />}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom>Resumen General</Typography>
            <Divider sx={{ mb: 2, bgcolor: theme.palette.divider }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de chats</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalChats}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de chatbots</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalChatbots}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de contactos</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalContacts}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de flujos de chatbot</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalFlows}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de transmisiones</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalBroadcast}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Total de plantillas</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dashboardData?.totalTemplets}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PanelControl;