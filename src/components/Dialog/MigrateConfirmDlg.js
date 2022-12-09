import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { HeaderTypo, NormalTypo } from '../Custom/CustomTypos';
import { ConfirmButton } from '../Custom/CustomButtons';

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  variant: 'menu'
};

MigrateConfirmDlg.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  activeNodes: PropTypes.array
};

export default function MigrateConfirmDlg({ open, onClose, onClick, disabled, activeNodes = [] }) {
  const { t } = useTranslation();
  const [nodeList, setNodeList] = useState(activeNodes);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!activeNodes.length) onClose();
    else setNodeList(activeNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodes]);

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    setSelected(selectedIndex);
    setError(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="migrate-dialog-title"
      aria-describedby="migrate-dialog-description"
      PaperProps={{
        sx: {
          background: '#161C24',
          borderRadius: '40px',
          px: 1,
          py: 2,
          maxWidth: '640px'
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
      <DialogTitle id="migrate-dialog-title">
        <HeaderTypo sx={{ py: 1, textAlign: 'center' }}>{t('btn-migrate')}</HeaderTypo>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="migrate-dialog-description"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <NormalTypo component="span" sx={{ py: 1, px: { xs: 1, md: 2 }, textAlign: 'center' }}>
            {t('dlg-migrate-confirm-label-1')} {t('dlg-backup-confirm-label-2')}
          </NormalTypo>
        </DialogContentText>
        <Box
          component="img"
          src="/static/ic_migrate.svg"
          alt="migrate_icon"
          width="60px"
          sx={{ margin: { xs: '10px auto 15px auto', md: '20px auto 30px auto' } }}
        />
        <Stack spacing={0.5} px={{ xs: 0, md: 2 }}>
          <NormalTypo sx={{ color: '#FF931E', p: 1 }}>
            {t('dlg-backup-confirm-node-provider')}
          </NormalTypo>
          <Select
            variant="outlined"
            value={selected}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}
            size="small"
            sx={{
              border: error ? '2px solid #EB5757' : '2px solid #FF931E',
              borderRadius: '20px',
              width: '100%',
              mr: { xs: 0, md: '100px' },
              alignItems: 'center',
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '0 !important'
              }
            }}
            MenuProps={{
              ...MenuProps,
              sx: {
                '& .MuiMenu-list': {
                  background: '#131317',
                  '& li': {
                    justifyContent: 'center'
                  }
                }
              }
            }}
          >
            {nodeList.map((item, i) => (
              <MenuItem key={i} value={i} autoFocus={selected === i}>
                <NormalTypo py={1} noWrap>
                  {item}
                </NormalTypo>
              </MenuItem>
            ))}
          </Select>
          {error > 0 && (
            <Typography fontSize={12} fontWeight={500} color="#EB5757">
              {t('dlg-backup-confirm-node-select-label')}
            </Typography>
          )}
        </Stack>
        <Stack
          direction="row"
          mt={{ xs: 3, md: 5 }}
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
            onClick={() => {
              if (typeof selected === 'number' && selected < activeNodes.length)
                onClick(activeNodes[selected]);
            }}
            sx={{ width: { xs: '120px', md: '240px' } }}
            disabled={disabled || !activeNodes.length}
          >
            {t('btn-migrate')}
          </ConfirmButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
