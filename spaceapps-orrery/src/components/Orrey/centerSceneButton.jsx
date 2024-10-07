import { Button } from '@mui/material';

export default function CenterSceneButton({ onClick }) {
  return (
    <div>
      <Button
        onClick={onClick}
        variant='outlined'
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '20px',
          transform: 'translateX(-50%)',
          zIndex: 2,
          backgroundColor: '#0017ff42',
          border: '1px solid #000f9f',
          color: 'white',
        }}
      >
        Center to sun
      </Button>
    </div>
  );
}
