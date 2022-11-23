import PropTypes from 'prop-types';
import { Chip, Grid, Typography, Skeleton } from '@mui/material';

NodeSummaryItem.propTypes = {
  nodeName: PropTypes.string,
  nodeURL: PropTypes.string,
  nodeStatus: PropTypes.bool,
  participated: PropTypes.string,
  isLoading: PropTypes.bool.isRequired
};

export default function NodeSummaryItem({
  nodeName,
  nodeURL,
  nodeStatus,
  participated,
  isLoading
}) {
  return (
    <div>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="20px"
          sx={{ bgcolor: '#E8F4FF', borderRadius: 1 }}
        />
      ) : (
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
          <Grid item xs={6} md={6}>
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
          <Grid item xs={2} md={2}>
            <Typography
              noWrap
              sx={{
                fontSize: { xs: '12px', md: '15px' },
                fontWeight: 600,
                lineHeight: { xs: '12px', md: '18px' }
              }}
            >
              {participated}
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
