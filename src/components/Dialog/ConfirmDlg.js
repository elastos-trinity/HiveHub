import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../CustomTypos';
import { PrimaryButton } from '../CustomButtons';

ConfirmDlg.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  onProgress: PropTypes.bool
};

export default function ConfirmDlg({ message, onClose, onClick, onProgress }) {
  return (
    <Stack spacing={4} width={320}>
      <Stack alignItems="center" spacing={2}>
        <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
        <Typography fontSize={16} fontWeight={400} textAlign="center">
          {message}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        <PrimaryButton btncolor="secondary" fullWidth onClick={onClose}>
          Close
        </PrimaryButton>
        <PrimaryButton btncolor="pink" fullWidth onClick={onClick} disabled={onProgress}>
          Confirm
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
