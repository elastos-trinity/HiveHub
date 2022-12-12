import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { HeaderTypo, NormalTypo } from '../Custom/CustomTypos';
import { ConfirmButton } from '../Custom/CustomButtons';

RemoveNodeConfirmDlg.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default function RemoveNodeConfirmDlg({ open, onClose, onClick, disabled }) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      aria-labelledby="remove-node-dialog-title"
      aria-describedby="remove-node-dialog-description"
      PaperProps={{
        sx: {
          background: '#161C24',
          borderRadius: '40px',
          px: 1,
          py: 2
        }
      }}
      TransitionProps={{
        sx: {
          background: 'rgba(22, 28, 36, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0px'
        }
      }}
    >
      <DialogTitle id="remove-node-dialog-title">
        <HeaderTypo sx={{ py: 1, textAlign: 'center' }}>
          {t('dlg-remove-node-confirm-title')}
        </HeaderTypo>
      </DialogTitle>
      <DialogContent>
        <img
          src="/static/ic_backup.svg"
          alt="remove_node_icon"
          width="60px"
          style={{ margin: '20px auto 30px auto' }}
        />
        <DialogContentText
          id="remove-node-dialog-description"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <NormalTypo component="span" sx={{ py: 1, px: { xs: 1, md: 2 }, textAlign: 'center' }}>
            {t('dlg-remove-node-confirm-label')}
          </NormalTypo>
        </DialogContentText>
        <Stack
          direction="row"
          mt={{ xs: 5, md: 7.5 }}
          spacing={{ xs: 1.5, md: 3 }}
          justifyContent="center"
        >
          <ConfirmButton
            onClick={onClose}
            sx={{
              color: '#FF931E',
              background: 'transparent',
              border: { xs: '1px solid #FF931E', md: '2px solid #FF931E' },
              width: { xs: '120px', md: '240px' }
            }}
          >
            {t('btn-cancel')}
          </ConfirmButton>
          <ConfirmButton
            onClick={onClick}
            sx={{ width: { xs: '120px', md: '240px' } }}
            disabled={disabled}
          >
            {t('btn-remove')}
          </ConfirmButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
