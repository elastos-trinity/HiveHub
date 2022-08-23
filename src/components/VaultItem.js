// import { useNavigate } from 'react-router-dom';
import { Stack, LinearProgress, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import ItemBox from './ItemBox';
import { NodeTitle, VaultValue } from './CustomTypos';
import { AccessButton } from './CustomButtons';

VaultItem.propTypes = {
  // id: PropTypes.number.isRequired,
  // name: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  used: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  ownerName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMyVault: PropTypes.bool,
  disabled: PropTypes.bool,
  sx: PropTypes.any
};

export default function VaultItem({
  // id,
  // name,
  total,
  used,
  time,
  ownerName,
  isMyVault = false,
  isLoading,
  disabled = false,
  sx
}) {
  // const navigate = useNavigate();

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
        <ItemBox time={time} sx={{ ...sx }} onClick={() => {}}>
          <Stack spacing={{ xs: '10px', sm: '20px' }} pt={{ xs: '10px', sm: '5px' }}>
            <NodeTitle>{`${ownerName}'s Vault`}</NodeTitle>
            <VaultValue>{`${used} MB / ${total} MB`}</VaultValue>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'end', sm: 'center' }}
              spacing={{ xs: 2, sm: 5 }}
            >
              <LinearProgress
                variant="determinate"
                value={(used / total) * 100}
                color="warning"
                sx={{ height: '10px', borderRadius: '100px', width: '100%' }}
              />
              {!isMyVault && <AccessButton disabled={disabled}>Access</AccessButton>}
            </Stack>
          </Stack>
        </ItemBox>
      )}
    </div>
  );
}
