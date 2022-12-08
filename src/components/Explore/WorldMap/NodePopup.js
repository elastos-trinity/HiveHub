import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip, Popper, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NodeTitle, NodeTimeLable, NormalTypo } from '../../Custom/CustomTypos';
import { getMapX, getMapY, getHexFromCircle } from './utils';
import { ConfirmButton } from '../../Custom/CustomButtons';

NodePopup.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.bool,
  time: PropTypes.string,
  description: PropTypes.string,
  endpoint: PropTypes.string,
  ownerDid: PropTypes.string,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default function NodePopup({
  longitude,
  latitude,
  name,
  status,
  time,
  description,
  endpoint,
  ownerDid,
  onClick,
  sx
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };
  let color = '#B3B3B3'; // blank
  if (status === true) color = '#67B674'; // online
  else if (status === false) color = '#E23A45'; // offline
  else color = '#FF881B'; // connecting
  return (
    <>
      <polygon
        points={getHexFromCircle(getMapX(longitude), getMapY(latitude), 4)}
        stroke="#1D1F21"
        fill={color}
        strokeWidth="1"
        onClick={handlePopoverOpen}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popper
        open={open}
        anchorEl={anchorEl}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        placement="bottom-start"
        transition
        sx={{ width: '500px', height: '150px', zIndex: 11111 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box
              onClick={() => {}}
              sx={{
                backgroundColor: '#131317',
                borderRadius: '20px',
                width: '100%',
                padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
                position: 'relative',
                ...sx
              }}
            >
              <NodeTimeLable
                sx={{
                  whiteSpace: 'nowrap',
                  position: 'absolute',
                  right: { xs: '10px', sm: '20px' },
                  top: { xs: '10px', sm: '30px' }
                }}
              >
                {time}
              </NodeTimeLable>
              <Stack spacing={{ xs: '20px', sm: '50px' }}>
                <Stack spacing="10px" py={{ xs: '10px', sm: '5px' }}>
                  <Stack direction="row" alignItems="center" spacing={{ xs: '10px', sm: '20px' }}>
                    <NodeTitle>{name}</NodeTitle>
                    {status ? (
                      <Chip
                        label={t('badge-online')}
                        color="success"
                        sx={{
                          height: { xs: '11px !important', md: '19px !important' },
                          color: '#FFFFFF',
                          '& .MuiChip-label': {
                            px: { xs: '5px !important', sm: '12px !important' }
                          }
                        }}
                      />
                    ) : (
                      <Chip
                        label={t('badge-offline')}
                        color="error"
                        sx={{
                          height: { xs: '11px !important', md: '19px !important' },
                          color: '#FFFFFF',
                          '& .MuiChip-label': {
                            px: { xs: '5px !important', sm: '12px !important' }
                          }
                        }}
                      />
                    )}
                  </Stack>
                  <NormalTypo sx={{ color: '#B3B3B3' }}>{description}</NormalTypo>
                </Stack>
                <Stack direction="row">
                  <Typography component="div" noWrap sx={{ flexGrow: 1 }} alignItems="center">
                    <Stack spacing={1}>
                      <Stack direction="row" sx={{ pb: '5px' }}>
                        <NormalTypo sx={{ color: '#FF931E', pr: { xs: '5px', sm: '10px' } }}>
                          {t('node-detail-endpoint')}:
                        </NormalTypo>
                        <NormalTypo>{endpoint}</NormalTypo>
                      </Stack>
                      <Stack direction="row" sx={{ pb: '5px' }}>
                        <NormalTypo sx={{ color: '#FF931E', pr: { xs: '5px', sm: '10px' } }}>
                          {t('node-detail-owner-did')}:
                        </NormalTypo>
                        <NormalTypo noWrap>{ownerDid}</NormalTypo>
                      </Stack>
                    </Stack>
                  </Typography>
                  <ConfirmButton onClick={onClick}>{t('btn-access')}</ConfirmButton>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}
