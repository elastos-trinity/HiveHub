import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomBox = styled(Box)({
  position: 'absolute',
  height: 20,
  width: 34.64,
  backgroundColor: 'transparent',
  transformOrigin: 'center center'
});

export default function HiveLogo() {
  return (
    <Box sx={{ width: 240, height: 50 }}>
      <Box component="span" sx={{ width: 60, height: 50, lineHeight: '50px' }}>
        <Box
          component="span"
          sx={{
            position: 'relative',
            top: '15px',
            width: 34.64,
            height: 40
          }}
        >
          <CustomBox sx={{ borderRight: `5px solid #FF931E` }} />
          <CustomBox sx={{ borderRight: `5px solid #FF931E`, transform: `rotate(60deg)` }} />
          <CustomBox sx={{ borderRight: `5px solid #FF931E`, transform: `rotate(300deg)` }} />
        </Box>

        <Box
          component="span"
          sx={{
            position: 'relative',
            top: '15px',
            left: '42px',
            width: 34.64,
            height: 40
          }}
        >
          <CustomBox sx={{ borderLeft: `5px solid #FF931E` }} />
          <CustomBox sx={{ borderLeft: `5px solid #FF931E`, transform: `rotate(60deg)` }} />
          <CustomBox sx={{ borderLeft: `5px solid #FF931E`, transform: `rotate(300deg)` }} />
        </Box>
      </Box>
      <Box
        sx={{
          fontSize: '40px',
          font: 'Montserrat',
          color: 'black',
          lineHeight: '50px',
          marginLeft: 9.5
        }}
      >
        <Box component="span" sx={{ fontWeight: 600 }}>
          Hive
        </Box>
        <Box component="span" sx={{ fontWeight: 300 }}>
          Hub
        </Box>
      </Box>
    </Box>
  );
}
