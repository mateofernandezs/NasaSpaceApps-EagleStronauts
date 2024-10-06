import React from 'react';
import { Paper, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PlanetInfo({ planet, onClose }) {
  if (!planet) return null;

  return (
    <Paper
      elevation={3}
      style={{
        position: 'fixed', // Para que se mantenga anclado en la esquina
        bottom: '20px', // Espaciado desde abajo
        left: '20px', // Espaciado desde la izquierda
        width: '300px',
        backgroundColor: 'rgba(30, 30, 30, 0.8)', // Color semitranslúcido
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: 2,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            fontSize: '2rem',
          }}
        >
          {planet.name}
        </Typography>
        <IconButton onClick={onClose} style={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider style={{ backgroundColor: 'white', margin: '10px 0' }} />

      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          color: 'lightgray',
          marginBottom: '10px',
        }}
      >
        {planet.description || 'Description not available'}
      </Typography>

      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Diameter:</strong> {planet.diameter || 'Diameter unknown'}
      </Typography>

      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Orbital Period:</strong>{' '}
        {planet.orbitalPeriod || 'Orbital period unknown'}
      </Typography>

      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Distance from Sun:</strong>{' '}
        {planet.distanceFromSun || 'Distance unknown'}
      </Typography>
    </Paper>
  );
}
