import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  LinearProgress,
  Skeleton,
  Typography,
  Box,
  useTheme,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Button
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { BadgeTypo, LabelTypo, NormalTypo } from './Custom/CustomTypos';
import { getValutPricingPlanBadge } from '../service/common';

VaultItemBox.propTypes = {
  total: PropTypes.number,
  used: PropTypes.number,
  ownerName: PropTypes.string,
  pricePlan: PropTypes.string,
  hasBackup: PropTypes.bool,
  isLoading: PropTypes.bool,
  sx: PropTypes.object,
  onClickBackup: PropTypes.func,
  onClickMigrate: PropTypes.func
};

export default function VaultItemBox({
  total,
  used,
  ownerName,
  pricePlan,
  hasBackup,
  isLoading,
  sx = {},
  onClickBackup,
  onClickMigrate
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const theme = useTheme();
  const matchSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      {isLoading ? (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            ...sx
          }}
        >
          <Typography component="div" variant="h4" width="50%">
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6" width="20%" sx={{ mb: 3 }}>
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6">
            <Skeleton animation="wave" />
          </Typography>
        </Box>
      ) : (
        <Box
          onClick={() => {}}
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            ...sx
          }}
        >
          <Button
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            sx={{
              minWidth: '0px',
              position: 'absolute',
              right: matchSmUp ? '24px' : '12px',
              top: matchSmUp ? '24px' : '12px'
            }}
          >
            <Icon icon="tabler:settings" fontSize={30} color="#FFF" rotate={0} />
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-end"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-end' ? 'left top' : 'left bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      sx={{
                        background: '#131317',
                        borderRadius: '10px',
                        py: '3px'
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          onClickBackup();
                          setOpen(false);
                        }}
                        sx={{
                          background: '#131317',
                          borderRadius: '10px',
                          width: { xs: '150px', md: '200px' },
                          px: { xs: '10px', md: '20px' }
                        }}
                      >
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box
                            sx={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: 'rgba(255, 147, 30, 0.05)',
                              borderRadius: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img src="/static/ic_backup.svg" alt="backup_icon" width="16px" />
                          </Box>
                          <LabelTypo sx={{ fontWeight: 700, color: '#FFF' }}>
                            {t('btn-backup')}
                          </LabelTypo>
                        </Stack>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onClickMigrate();
                          setOpen(false);
                        }}
                        sx={{
                          background: '#131317',
                          borderRadius: '10px',
                          width: { xs: '150px', md: '200px' },
                          px: { xs: '10px', md: '20px' }
                        }}
                      >
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box
                            sx={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: 'rgba(255, 147, 30, 0.05)',
                              borderRadius: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              pl: '4px'
                            }}
                          >
                            <img src="/static/ic_migrate.svg" alt="migrate_icon" width="24px" />
                          </Box>
                          <LabelTypo sx={{ fontWeight: 700, color: '#FFF' }}>
                            {t('btn-migrate')}
                          </LabelTypo>
                        </Stack>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Stack direction="row" spacing={2} alignItems="center">
            <NormalTypo sx={{ fontWeight: 600, color: '#FFF' }}>{`${ownerName}${t(
              'vault-s-vault'
            )}`}</NormalTypo>
            <BadgeTypo>{getValutPricingPlanBadge(pricePlan)}</BadgeTypo>
            {!hasBackup && (
              <BadgeTypo sx={{ color: '#E23A45', background: 'rgba(226, 58, 69, 0.05)' }}>
                {t('badge-not-backup')}
              </BadgeTypo>
            )}
          </Stack>
          <LabelTypo py={1}>{`${used} MB / ${total} MB`}</LabelTypo>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'end', sm: 'center' }}
            spacing={{ xs: 2, sm: 5 }}
            my={{ xs: '10px', sm: '20px' }}
          >
            <LinearProgress
              variant="determinate"
              value={(used / total ?? 0) * 100}
              color="warning"
              sx={{
                height: '10px',
                borderRadius: '100px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </Stack>
        </Box>
      )}
    </div>
  );
}
