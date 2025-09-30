import React from 'react';
import { Grid, Card, Typography, Box, Chip, Button } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useNavigate } from 'react-router-dom';

const InverterCard = ({ inverter }) => {
  const navigate = useNavigate();
  const isIdle =
    inverter.activePower === 0 &&
    inverter.mpptPower === 0 &&
    inverter.todayEnergy === 0 &&
    inverter.totalVoltage === 0 &&
    inverter.totalCurrent === 0 &&
    inverter.pv1Voltage === 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 2,
        background: 'linear-gradient(135deg, #065f46, #0891b2)',
        color: '#fff',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <BoltIcon />
          <Typography variant="h6" fontWeight="bold">{inverter.stationLabel}</Typography>
        </Box>
        <Chip
          label={isIdle ? "Idle" : "Running"}
          sx={{
            backgroundColor: isIdle ? '#ef4444' : 'green',
            color: '#fff',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Active Power</Typography>
        <Typography variant="h4" fontWeight="bold">{inverter.activePower} kW</Typography>
      </Box>

      <Grid container spacing={1} mt={1}>
        <Grid item xs={6}>
          <Box sx={{ background: 'rgba(255,255,255,0.15)', p: 1, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <WbSunnyIcon fontSize="small" />
              <Typography variant="body2" fontWeight="500">MPPT Power</Typography>
            </Box>
            <Typography variant="h6">{inverter.mpptPower} W</Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ background: 'rgba(255,255,255,0.15)', p: 1, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="500">Hoy</Typography>
            <Typography variant="h6">{inverter.todayEnergy} kWh</Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ background: 'rgba(255,255,255,0.15)', p: 1, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="500">Total</Typography>
            <Typography variant="h6">{inverter.totalVoltage} V / {inverter.totalCurrent} A</Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ background: 'rgba(255,255,255,0.15)', p: 1, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="500">PV1</Typography>
            <Typography variant="h6">{inverter.pv1Voltage} V</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          color="inherit"
          sx={{ fontWeight: 'bold', textTransform: 'none' }}
          onClick={() =>
            navigate(`/devices/${inverter.deviceId}`, {
              state: {
                stationLabel: inverter.stationLabel,
                deviceId: inverter.deviceId,
              },
            })
          }
        >
          View details
        </Button>
      </Box>
    </Card>
  );
};

export default InverterCard;
