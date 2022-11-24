import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SmallHexagon from '../SmallHexagon';
import { PlusButton } from '../Custom/CustomButtons';

const FeatureGrid = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  padding: '20px 0 30px',
  fontSize: '30px',
  lineHeight: '37px',
  [theme.breakpoints.down('md')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

NodeInitialView.propTypes = {
  sx: PropTypes.object
};

export default function NodeInitialView({ sx = {} }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ ...sx }}>
      <FeatureGrid item xs={12} sm={6} md={3} spacing={2}>
        <Box sx={{ margin: '20px 0 20px' }}>
          <SmallHexagon
            borderColor="#FF931E"
            rootHexagon
            sideLength={30}
            borderWidth={2}
            backColor="transparent"
          >
            <Typography variant="h3" sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}>
              +
            </Typography>
            <Box
              sx={{
                transform: 'rotate(300deg)',
                position: 'absolute',
                top: '-23px',
                left: '-22px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
            <Box
              sx={{
                transform: 'rotate(120deg)',
                position: 'absolute',
                top: '21px',
                left: '53px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
          </SmallHexagon>
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '25px',
            lineHeight: '30px',
            color: '#FFFFFF',
            py: 1
          }}
        >
          Become your own node operator now!
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '18px',
            color: '#C4C4C4',
            py: 1
          }}
        >
          Create and deploy your own Hive node!
        </Typography>
      </FeatureGrid>
      <Stack mt={{ xs: 4, md: 6 }} spacing={{ xs: 3.5, md: 5 }} sx={{ alignItems: 'center' }}>
        <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/envconfig')}>
          Configure .env file
        </PlusButton>
        <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/create')}>
          Create node
        </PlusButton>
      </Stack>
    </Box>
  );
}
