import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip, Popper, Fade, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BaseTypography } from '../../../Custom/CustomTypos';
import { getMapX, getMapY, getHexFromCircle } from './utils';
import Scrollbar from '../../../Scrollbar';

NodePopup.propTypes = {
  data: PropTypes.any,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default function NodePopup({ data = [], isLoading, onClick, sx }) {
  const { t } = useTranslation();
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setLatitude] = React.useState(0);
  const [nodeColor, setNodeColor] = React.useState('#B3B3B3');
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (Array.isArray(data) && data.length) {
      setLongitude(data[0]?.longitude ?? 0);
      setLatitude(data[0]?.latitude ?? 0);
      const status = data[0]?.status || false;
      let color = '#B3B3B3'; // blank
      if (status === true) color = '#67B674'; // online
      else if (status === false) color = '#E23A45'; // offline
      else color = '#FF881B'; // connecting
      setNodeColor(color);
    }
  }, [isLoading, data]);

  return (
    <>
      <polygon
        points={getHexFromCircle(getMapX(longitude), getMapY(latitude), 4)}
        stroke="#1D1F21"
        fill={nodeColor}
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
        sx={{ width: '320px', zIndex: 11111 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Stack
              spacing={2.5}
              sx={{
                backgroundColor: '#131317',
                borderRadius: '20px',
                width: '100%',
                height: '300px',
                overflow: 'auto',
                padding: '10px 10px 10px 20px',
                ...sx
              }}
            >
              <Scrollbar
                sx={{
                  height: '100%',
                  '& .simplebar-content': {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }}
              >
                {data.map((item, index) => {
                  const {
                    name,
                    created: time,
                    remark: description,
                    ip: endpoint,
                    owner_did: ownerDid,
                    status,
                    nid
                  } = item;
                  return (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <BaseTypography
                        sx={{
                          color: '#B3B3B3',
                          fontSize: '10px',
                          lineHeight: '12px',
                          fontWeight: 400,
                          whiteSpace: 'nowrap',
                          position: 'absolute',
                          right: '10px',
                          top: '10px'
                        }}
                      >
                        {time}
                      </BaseTypography>
                      <Stack spacing="20px">
                        <Stack spacing="10px" py="10px">
                          <Stack direction="row" alignItems="center" spacing="10px">
                            <BaseTypography
                              sx={{
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '24px',
                                color: '#FFF'
                              }}
                            >
                              {name}
                            </BaseTypography>
                            {status ? (
                              <Chip
                                label={t('badge-online')}
                                color="success"
                                sx={{
                                  height: '11px !important',
                                  color: '#FFFFFF',
                                  '& .MuiChip-label': {
                                    px: '5px !important'
                                  }
                                }}
                              />
                            ) : (
                              <Chip
                                label={t('badge-offline')}
                                color="error"
                                sx={{
                                  height: '11px !important',
                                  color: '#FFFFFF',
                                  '& .MuiChip-label': {
                                    px: '5px !important'
                                  }
                                }}
                              />
                            )}
                          </Stack>
                          <BaseTypography
                            sx={{
                              fontWeight: 400,
                              fontSize: '10px',
                              lineHeight: '12px',
                              color: '#B3B3B3'
                            }}
                          >
                            {description}
                          </BaseTypography>
                        </Stack>
                        <Stack direction="row" sx={{ display: 'flex', alignItems: 'end' }}>
                          <Typography
                            component="div"
                            noWrap
                            sx={{ flexGrow: 1 }}
                            alignItems="center"
                          >
                            <Stack spacing={1}>
                              <Stack direction="row" sx={{ pb: '5px' }}>
                                <BaseTypography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: '10px',
                                    lineHeight: '12px',
                                    color: '#B3B3B3',
                                    pr: '5px'
                                  }}
                                >
                                  {t('node-detail-endpoint')}:
                                </BaseTypography>
                                <BaseTypography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: '10px',
                                    lineHeight: '12px',
                                    color: '#FFF'
                                  }}
                                >
                                  {endpoint}
                                </BaseTypography>
                              </Stack>
                              <Stack direction="row" sx={{ pb: '5px' }}>
                                <BaseTypography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: '10px',
                                    lineHeight: '12px',
                                    color: '#B3B3B3',
                                    pr: '5px'
                                  }}
                                >
                                  {t('node-detail-owner-did')}:
                                </BaseTypography>
                                <BaseTypography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: '10px',
                                    lineHeight: '12px',
                                    color: '#FFF'
                                  }}
                                  noWrap
                                >
                                  {ownerDid}
                                </BaseTypography>
                              </Stack>
                            </Stack>
                          </Typography>
                          <Button
                            sx={{
                              mt: '10px',
                              background: 'linear-gradient(270deg, #FF8A00 0%, #E23A45 100%)',
                              borderRadius: '200px',
                              color: 'white',
                              fontWeight: 600,
                              lineHeight: '12px',
                              fontSize: '10px',
                              height: '30px',
                              padding: '7px 14px',
                              width: 'fit-content',
                              textTransform: 'inherit'
                            }}
                            onClick={() => onClick(nid)}
                          >
                            {t('btn-access')}
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Scrollbar>
            </Stack>
          </Fade>
        )}
      </Popper>
    </>
  );
}
