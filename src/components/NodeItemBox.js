import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip, Skeleton, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NodeTitle, NodeTimeLable, NormalTypo } from './Custom/CustomTypos';

NodeItemBox.propTypes = {
  nodeId: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.bool,
  time: PropTypes.string,
  description: PropTypes.string,
  endpoint: PropTypes.string,
  isOwner: PropTypes.bool,
  isLoading: PropTypes.bool,
  sx: PropTypes.object,
  onRemoveNode: PropTypes.func
};

export default function NodeItemBox({
  nodeId,
  name,
  status,
  time,
  description,
  endpoint,
  isOwner = false,
  isLoading,
  sx,
  onRemoveNode = null
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            cursor: 'pointer',
            ...sx
          }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ my: 1 }}>
            <Typography component="div" variant="h4" width="50%">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h4" width="20%">
              <Skeleton animation="wave" />
            </Typography>
          </Stack>
          <Typography component="div" variant="h6" sx={{ mb: 3 }}>
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6">
            <Skeleton animation="wave" />
          </Typography>
        </Box>
      ) : (
        <Box
          onClick={() => {
            if (!isLoading && isOwner) navigate(`/dashboard/node/detail/${nodeId}`);
          }}
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            cursor: isOwner ? 'pointer' : 'auto',
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
            <Typography component="div" noWrap sx={{ flexGrow: 1 }} alignItems="center">
              <Stack direction="row" sx={{ pb: '5px' }}>
                <NormalTypo sx={{ color: '#FF931E', pr: { xs: '5px', sm: '10px' } }}>
                  {t('node-detail-endpoint')}:
                </NormalTypo>
                <NormalTypo>{endpoint}</NormalTypo>
                {isOwner && (
                  <Button
                    sx={{
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      fontSize: { xs: '10px', md: '20px' },
                      color: '#7a7a7a',
                      right: { xs: '10px', sm: '20px' },
                      bottom: { xs: '10px', sm: '13px' }
                    }}
                    variant="text"
                    onClick={(e) => {
                      onRemoveNode(nodeId);
                      e.stopPropagation();
                    }}
                  >
                    {t('btn-remove')}
                  </Button>
                )}
              </Stack>
            </Typography>
          </Stack>
        </Box>
      )}
    </div>
  );
}
