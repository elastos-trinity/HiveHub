import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

HiveLogo.propTypes = {
  mobile: PropTypes.bool
};

export default function HiveLogo({ mobile = false }) {
  return (
    <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
      <img
        src={`/static/${mobile ? 'logo_mobile.svg' : 'logo_web.svg'}`}
        alt="logo"
        width="100%"
        height="100%"
      />
    </Box>
  );
}
