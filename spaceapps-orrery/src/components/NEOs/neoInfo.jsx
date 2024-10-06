import React from 'react';
import { Paper, Typography, Divider, IconButton } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

const AsteroidInfo = ({ asteroid, onClose }) => {
  if (!asteroid) return null;

  return (
    <Paper
      elevation={3}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '300px',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
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
          {asteroid.name || '21P/Giacobini-Zinner'}
        </Typography>
        <IconButton onClick={onClose} style={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider style={{ backgroundColor: 'white', margin: '10px 0' }} />

      <Typography
        variant='h5'
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.5rem',
          marginBottom: '5px',
        }}
      >
        {asteroid.fullName || 'Full Name'}
      </Typography>

      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          color: 'lightgray',
          marginBottom: '10px',
        }}
      >
        {asteroid.IAUName || 'Giacobini-Zinner'}
      </Typography>

      {/* PHA */}
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>PHA:</strong>{' '}
        {asteroid.PHA ? 'Posibilidad de colisión' : 'No es un PHA'}
      </Typography>

      {asteroid.collisionRisk === 'Y' && (
        <Typography
          sx={{
            color: 'red',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          <WarningIcon sx={{ marginRight: '5px', color: 'red' }} />
          Posibilidad de colisión
        </Typography>
      )}

      {/* Información adicional */}
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Diámetro:</strong> {asteroid.diameter || 'DIÁMETRO 2.0 km'}
      </Typography>
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Periodo orbital:</strong> 2.39e+03
      </Typography>
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>Earth MOID:</strong> Distancia a la Tierra en años luz:{' '}
        {asteroid.earthMOID || '0.0179 au'}
      </Typography>
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '5px',
        }}
      >
        <strong>SPK-ID:</strong> {asteroid.spkID || '432555'}
      </Typography>
    </Paper>
  );
};

export default AsteroidInfo;
