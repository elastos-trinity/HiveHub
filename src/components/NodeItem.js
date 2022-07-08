import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Chip, Button, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { MHidden } from './@material-extend';
import ItemBox from './ItemBox';

const NodeTitle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
    lineHeight: '36px'
  }
}));

const NodeDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

const NodeValue = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 600,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF931E',
  height: '25px',
  padding: '6px 14px',
  borderRadius: '200px',
  boxSizing: 'border-box',
  color: '#FFF',
  fontSize: '10px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  },
  [theme.breakpoints.up('sm')]: {
    height: '45px',
    fontSize: '15px',
    padding: '13px 29px'
  }
}));

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
              {!isMyNode && (
                <CustomButton
                  disabled={!status}
                  onClick={() => navigate(`/dashboard/nodes/detail/${id}`)}
                >
                  Access
                </CustomButton>
              )}
            </Stack>
          </Stack>
        </ItemBox>
      )}
    </div>
  );
}
