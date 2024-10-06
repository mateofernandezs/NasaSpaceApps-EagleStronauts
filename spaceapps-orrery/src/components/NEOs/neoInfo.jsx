import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const AsteroidInfo = ({ asteroid }) => {
    if (!asteroid) return null;

    return (
        <Paper
            elevation={3}
            style={{
                position: 'absolute',
                top: '350px',
                left: '60px',
                width: '300px',
                backgroundImage: 'linear-gradient(rgba(30, 30, 30, 0.9), rgba(100, 100, 100, 0.7))',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                zIndex: 2,
                backdropFilter: 'blur(10px)',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '2rem',
                }}
            >
                {asteroid.name}
            </Typography>
            <Divider style={{ backgroundColor: 'white', margin: '10px 0' }} />

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.5rem',
                    marginBottom: '5px',
                }}
            >
                {asteroid.fullName || "Full Name"}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    color: 'lightgray',
                    marginBottom: '10px',
                }}
            >
                {asteroid.IAUName || "IAU Name"}
            </Typography>

            {/* PHA */}
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    marginBottom: '5px',
                }}
            >
                <strong>PHA:</strong> {asteroid.PHA ? "Posibilidad de colisión" : "No es un PHA"}
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
                    <WarningIcon sx={{ marginRight: '5px', color: 'red' }} /> {/* Ícono de advertencia */}
                    Posibilidad de colisión
                </Typography>
            )}

            {/* Información adicional */}
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    marginBottom: '5px',
                }}
            >
                <strong>Diámetro:</strong> {asteroid.diameter || "DIÁMETRO 4 km"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    marginBottom: '5px',
                }}
            >
                <strong>Periodo orbital:</strong> El período orbital es el tiempo que le toma a un astro recorrer su órbita.
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    marginBottom: '5px',
                }}
            >
                <strong>Earth MOID:</strong> Distancia a la Tierra en años luz: {asteroid.earthMOID || "86532 au"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                    marginBottom: '5px',
                }}
            >
                <strong>SPK-ID:</strong> {asteroid.spkID || "432555"}
            </Typography>
        </Paper>
    );
};

export default AsteroidInfo;
