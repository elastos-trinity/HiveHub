import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { HeaderTypo } from '../Custom/CustomTypos';

CredentialIssueConfirmDlg.propTypes = {
  open: PropTypes.bool
};

export default function CredentialIssueConfirmDlg({ open }) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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
      <DialogTitle id="alert-dialog-title">
        <HeaderTypo>{t('alert-operation-tip-title')}</HeaderTypo>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('alert-operation-tip-label')}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
