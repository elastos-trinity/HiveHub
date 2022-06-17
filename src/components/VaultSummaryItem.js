import PropTypes from 'prop-types';
import { Stack, Typography, LinearProgress } from '@mui/material';

VaultSummaryItem.propTypes = {
  vaultName: PropTypes.string,
  vaultTotal: PropTypes.number,
  vaultUsed: PropTypes.number
};

export default function VaultSummaryItem({ vaultName, vaultTotal, vaultUsed }) {
  return (
    <Stack spacing={2}>
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
    </Stack>
  );
}
