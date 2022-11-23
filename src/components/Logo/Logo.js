import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

HiveHubLogo.propTypes = {
  mobile: PropTypes.bool
};

export default function HiveHubLogo({ mobile = false }) {
  return (
    <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
      <img
        src={`/static/${mobile ? 'Logo.svg' : 'Logo.svg'}`}
        alt="logo"
        width="100%"
        height="100%"
      />
    </Box>
  );
}
