import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Stack, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoText = styled(Typography)({
  font: 'Montserrat',
  color: 'black'
});

HiveLogo.propTypes = {
  small: PropTypes.bool
};

export default function HiveLogo({ small = false }) {
  const logoWidth = small ? '25px' : '50px';
  return (
    <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
        <Stack sx={{ width: logoWidth, height: logoWidth }}>
          <img src="/static/logo.svg" alt="logo" width="100%" height="100%" />
        </Stack>
        <Stack direction="row" spacing={0}>
          <LogoText
            sx={{
              lineHeight: small ? '24px' : '48px',
              fontSize: small ? '20px' : '40px',
              fontWeight: 600
            }}
          >
            Hive
          </LogoText>
          <LogoText
            sx={{
              lineHeight: small ? '24px' : '48px',
              fontSize: small ? '20px' : '40px',
              fontWeight: 300
            }}
          >
            Hub
          </LogoText>
        </Stack>
      </Stack>
    </Box>
  );
}
