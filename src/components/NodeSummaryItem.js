import PropTypes from 'prop-types';
import { Chip, Grid, Typography } from '@mui/material';

NodeSummaryItem.propTypes = {
  nodeName: PropTypes.string,
  nodeURL: PropTypes.string,
  nodeStatus: PropTypes.bool
};

export default function NodeSummaryItem({ nodeName, nodeURL, nodeStatus }) {
  return (
    <Grid container sx={{ textAlign: 'center' }} alignItems="center">
      <Grid item xs={2} md={2}>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '12px', md: '15px' },
            fontWeight: 700,
            textAlign: 'left',
            lineHeight: { xs: '15px', md: '18px' }
          }}
        >
          {nodeName}
        </Typography>
      </Grid>
      <Grid item xs={8} md={8}>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '12px', md: '15px' },
            fontWeight: 600,
            lineHeight: { xs: '12px', md: '18px' }
          }}
        >
          {nodeURL}
        </Typography>
      </Grid>
      <Grid item xs={2} md={2}>
        {nodeStatus ? (
          <Chip
            label="online"
            color="success"
            sx={{ height: { xs: '16px !important', md: '20px !important' }, color: 'white' }}
          />
        ) : (
          <Chip
            label="offline"
            sx={{ height: { xs: '16px !important', md: '20px !important' }, color: 'black' }}
          />
        )}
      </Grid>
    </Grid>
  );
}
