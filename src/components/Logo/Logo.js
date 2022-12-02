import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

HiveHubLogo.propTypes = {
  mobile: PropTypes.bool
};

export default function HiveHubLogo({ mobile = false }) {
  return (
    <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
      <img src="/static/Logo.svg" alt="logo" width={mobile ? '120px' : '100%'} />
    </Box>
  );
}
