import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SmallHexagon from '../SmallHexagon';
import { LandingTitleTypo } from '../CustomTypos';

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

FeaturePanel.propTypes = {
  sx: PropTypes.object
};

export default function FeaturePanel({ sx = {} }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1600px',
        minHeight: '420px',
        margin: '80px auto',
        padding: '20px',
        background: 'rgba(255, 147, 30, 0.05)',
        boxShadow: '0px 0px 100px rgba(0, 0, 0, 0.05)',
        borderRadius: '50px',
        position: 'relative',
        zIndex: 10,
        ...sx
      }}
    >
      <LandingTitleTypo sub={Boolean(true)}>Features</LandingTitleTypo>
      <Grid container direction="row" alignItems="center" justifyContent="space-around">
        <FeatureGrid item xs={12} sm={6} md={3} sx={{ position: 'relative', top: '2px' }}>
          <Box sx={{ margin: '40px 0 40px' }}>
            <SmallHexagon
              borderColor="#FF931E"
              rootHexagon
              sideLength={30}
              borderWidth={2}
              backColor="transparent"
            >
              <Typography
                variant="h3"
                sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}
              >
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
          <span style={{ color: '#FFFFFF' }}>Deploy Node</span>
        </FeatureGrid>
        <FeatureGrid item xs={12} sm={6} md={3}>
          <Box sx={{ margin: '30px 0 40px' }}>
            <Box
              sx={{
                width: '70px',
                height: '70px',
                lineHeight: '70px',
                margin: '0 auto',
                borderRadius: '5px',
                border: '2px solid #FF931E'
              }}
            >
              <Typography
                variant="h3"
                sx={{ color: '#FF931E', height: '70px', lineHeight: '70px' }}
              >
                +
              </Typography>
            </Box>
          </Box>
          <span style={{ color: '#FFFFFF' }}>Create Vault</span>
        </FeatureGrid>
        <FeatureGrid item xs={12} sm={6} md={3}>
          <Box sx={{ margin: '30px 0 40px' }}>
            <Box
              sx={{
                width: '65px',
                height: '65px',
                margin: '0 auto',
                borderRadius: '5px',
                border: '2px solid #FF931E',
                boxShadow: ' 8px -8px 0px 0px rgba(255, 201, 143, 1)',
                position: 'relative',
                top: '5px',
                left: '-5px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  color: '#FF931E',
                  height: '20px',
                  width: '20px',
                  margin: '0 auto',
                  borderRadius: '10px',
                  border: '2px solid #FF931E'
                }}
              />
            </Box>
          </Box>
          <span style={{ color: '#FFFFFF' }}>Backup</span>
        </FeatureGrid>
        <FeatureGrid item xs={12} sm={6} md={3}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{ margin: '30px 0 40px' }}
          >
            <Grid item>
              <Box
                sx={{
                  width: '65px',
                  height: '65px',
                  margin: '0 auto',
                  borderRadius: '5px',
                  border: '2px solid #FF931E',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    color: '#FF931E',
                    height: '20px',
                    width: '20px',
                    margin: '0 auto',
                    borderRadius: '10px',
                    border: '2px solid #FF931E'
                  }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '35px',
                  height: '35px',
                  margin: '0 auto',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(255, 212, 165, 1)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    color: '#FF931E',
                    height: '10px',
                    width: '10px',
                    margin: '0 auto',
                    borderRadius: '10px',
                    border: '2px solid white'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <span style={{ color: '#FFFFFF' }}>Migrate</span>
        </FeatureGrid>
      </Grid>
    </Box>
  );
}
