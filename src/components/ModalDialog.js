import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

ModalDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
};

export default function ModalDialog({ open, onClose, children }) {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={matchDownMd}
      open={open}
      onClose={onClose}
      onBackdropClick="false"
      sx={{ background: '#1890FF90' }}
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
          padding: { xs: 4, md: 8 },
          borderRadius: { xs: 0, md: 5 }
        }
      }}
    >
      {children}
    </Dialog>
  );
}
