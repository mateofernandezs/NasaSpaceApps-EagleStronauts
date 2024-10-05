import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';

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
                backgroundColor: 'rgba(51, 51, 51, 0.8)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                zIndex: 2,
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
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>Full Name:</strong> {asteroid.fullName || "full nameeeee"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>PHA:</strong> {asteroid.PHA || "PHA"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>Diameter:</strong> {asteroid.diameter || "DIAMETRO 4 km"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>Orbit ID:</strong> {asteroid.orbitID || "400"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>Period:</strong> {asteroid.period || "8 years"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>Earth MOID:</strong> {asteroid.earthMOID || "86532 au"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '1.2rem',
                }}
            >
                <strong>SPK-ID:</strong> {asteroid.spkID || "432555"}
            </Typography>
            {asteroid.collisionRisk === 'Y' && (
                <Typography
                    sx={{
                        color: 'red',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '1.2rem',
                    }}
                >
                    Riesgo de colisión
                </Typography>
            )}
        </Paper>
    );
};

export default AsteroidInfo;
