import PropTypes from 'prop-types';
import { Stack, Typography, LinearProgress, Skeleton } from '@mui/material';

VaultSummaryItem.propTypes = {
  vaultName: PropTypes.string,
  vaultTotal: PropTypes.number,
  vaultUsed: PropTypes.number,
  isLoading: PropTypes.bool.isRequired
};

export default function VaultSummaryItem({ vaultName, vaultTotal, vaultUsed, isLoading }) {
  return (
    <Stack spacing={2}>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="50px"
          sx={{ bgcolor: '#E8F4FF', borderRadius: 1 }}
        />
      ) : (
        <>
          <Typography
            sx={{
              fontSize: { xs: '12px', md: '15px' },
              fontWeight: 600,
              lineHeight: { xs: '15px', md: '18px' }
            }}
          >
            {vaultName}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '8px', md: '10px' },
              fontWeight: 400,
              lineHeight: { xs: '10px', md: '12px' }
            }}
          >
            {`${vaultUsed} MB / ${vaultTotal} MB`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(vaultUsed / vaultTotal) * 100}
            color="warning"
            sx={{ height: '10px', borderRadius: '100px' }}
          />
        </>
      )}
    </Stack>
  );
}
