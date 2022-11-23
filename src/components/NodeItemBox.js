import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip, Skeleton } from '@mui/material';
import { NodeTitle, NodeTimeLable, NormalTypo } from './Custom/CustomTypos';

NodeItemBox.propTypes = {
  nodeId: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.bool,
  time: PropTypes.string,
  description: PropTypes.string,
  endpoint: PropTypes.string,
  isLoading: PropTypes.bool,
  sx: PropTypes.object
};

export default function NodeItemBox({
  nodeId,
  name,
  status,
  time,
  description,
  endpoint,
  isLoading,
  sx
}) {
  const navigate = useNavigate();

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
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              whiteSpace: 'nowrap',
              position: 'absolute',
              right: { xs: '10px', sm: '20px' },
              top: { xs: '10px', sm: '30px' }
            }}
          />
          <Stack>
            <Stack spacing="10px" py={{ xs: '10px', sm: '5px' }}>
              <Stack direction="row" alignItems="center" spacing={{ xs: '10px', sm: '20px' }}>
                <Skeleton variant="rectangular" animation="wave" />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    height: { xs: '11px !important', md: '19px !important' },
                    color: '#FFFFFF',
                    '& .MuiChip-label': {
                      px: { xs: '5px !important', sm: '12px !important' }
                    }
                  }}
                />
              </Stack>
              <Skeleton variant="rectangular" animation="wave" sx={{ color: '#B3B3B3' }} />
            </Stack>
            <Typography
              component="div"
              noWrap
              sx={{ flexGrow: 1, mt: { xs: '20px', sm: '50px' } }}
              alignItems="center"
            >
              <Stack direction="row" sx={{ pb: '5px' }}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ color: '#FF931E', pr: { xs: '5px', sm: '10px' } }}
                />
                <Skeleton variant="rectangular" animation="wave" />
              </Stack>
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box
          onClick={() => {
            if (!isLoading) navigate(`/dashboard/node/detail/${nodeId}`);
          }}
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
          <Stack>
            <Stack spacing="10px" py={{ xs: '10px', sm: '5px' }}>
              <Stack direction="row" alignItems="center" spacing={{ xs: '10px', sm: '20px' }}>
                <NodeTitle>{name}</NodeTitle>
                {status ? (
                  <Chip
                    label="online"
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
                    label="offline"
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
            <Typography
              component="div"
              noWrap
              sx={{ flexGrow: 1, mt: { xs: '20px', sm: '50px' } }}
              alignItems="center"
            >
              <Stack direction="row" sx={{ pb: '5px' }}>
                <NormalTypo sx={{ color: '#FF931E', pr: { xs: '5px', sm: '10px' } }}>
                  Endpoint:
                </NormalTypo>
                <NormalTypo>{endpoint}</NormalTypo>
              </Stack>
            </Typography>
          </Stack>
        </Box>
      )}
    </div>
  );
}
