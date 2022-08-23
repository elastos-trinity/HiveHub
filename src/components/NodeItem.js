import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Chip, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { MHidden } from './@material-extend';
import ItemBox from './ItemBox';
import { NodeTitle, NodeValue, NodeDescription } from './CustomTypos';
import { AccessButton, DestroyVaultButton } from './CustomButtons';

NodeItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  did: PropTypes.string.isRequired,
  ownerName: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isMyNode: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  sx: PropTypes.any
};

export default function NodeItem({
  id,
  name,
  status,
  description,
  ip,
  did,
  ownerName,
  time,
  isMyNode = false,
  isLoading,
  onClick,
  sx
}) {
  const navigate = useNavigate();

  return (
    <div>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          sx={{ bgcolor: '#E8F4FF', borderRadius: 1, height: { xs: '150px', md: '200px' } }}
        />
      ) : (
        <ItemBox
          time={time}
          sx={{ ...sx }}
          onClick={() => {
            if (isMyNode) navigate(`/dashboard/nodes/detail/${id}`);
          }}
        >
          <Stack>
            <Stack spacing="10px" py={{ xs: '10px', sm: '5px' }}>
              <Stack direction="row" alignItems="center" spacing={{ xs: '10px', sm: '20px' }}>
                <NodeTitle>{isMyNode ? name : `${ownerName}'s Node`}</NodeTitle>
                {status ? (
                  <Chip
                    label="online"
                    color="success"
                    sx={{
                      height: { xs: '11px !important', md: '19px !important' },
                      color: 'white',
                      '& .MuiChip-label': {
                        px: { xs: '5px !important', sm: '12px !important' }
                      }
                    }}
                  />
                ) : (
                  <Chip
                    label="offline"
                    sx={{
                      height: { xs: '11px !important', md: '19px !important' },
                      color: 'black',
                      '& .MuiChip-label': {
                        px: { xs: '5px !important', sm: '12px !important' }
                      }
                    }}
                  />
                )}
              </Stack>
              <NodeDescription>{description}</NodeDescription>
            </Stack>

            <Stack direction="row" mt={{ xs: '20px', sm: '50px' }}>
              <MHidden width="mdDown">
                <Typography component="div" noWrap sx={{ flexGrow: 1 }} alignItems="center">
                  <Stack direction="row" sx={{ pb: '5px' }}>
                    <NodeDescription sx={{ pr: { xs: '5px', sm: '10px' } }}>IP:</NodeDescription>
                    <NodeValue sx={{ pr: '50px' }}>{ip}</NodeValue>
                    <NodeDescription sx={{ pr: { xs: '5px', sm: '10px' } }}>
                      Owner DID:
                    </NodeDescription>
                    <NodeValue noWrap sx={{ pr: '20px' }}>
                      {did}
                    </NodeValue>
                  </Stack>
                </Typography>
              </MHidden>
              <MHidden width="mdUp">
                <Typography component="div" noWrap sx={{ flexGrow: 1 }}>
                  <Stack spacing="8px">
                    <Stack direction="row" spacing={{ xs: '5px', sm: '10px' }}>
                      <NodeDescription>IP:</NodeDescription>
                      <NodeValue noWrap>{ip}</NodeValue>
                    </Stack>
                    <Stack direction="row" spacing={{ xs: '5px', sm: '10px' }}>
                      <NodeDescription>Owner DID:</NodeDescription>
                      <NodeValue noWrap>{did}</NodeValue>
                    </Stack>
                  </Stack>
                </Typography>
              </MHidden>
              {isMyNode ? (
                <DestroyVaultButton onClick={onClick}>Remove</DestroyVaultButton>
              ) : (
                <AccessButton
                  disabled={!status}
                  onClick={() => navigate(`/dashboard/explore/detail/${id}`)}
                >
                  Access
                </AccessButton>
              )}
            </Stack>
          </Stack>
        </ItemBox>
      )}
    </div>
  );
}
