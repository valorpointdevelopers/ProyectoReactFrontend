import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color = '#1976d2' }) => {
  return (
    <Card sx={{ minWidth: 200, textAlign: 'center', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;