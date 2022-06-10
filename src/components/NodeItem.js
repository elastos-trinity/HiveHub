import PropTypes from 'prop-types';
import { Chip, Grid, Typography } from '@mui/material';

NodeItem.prototype = {
  nodeName: PropTypes.string,
  nodeURL: PropTypes.string,
  nodeStatus: PropTypes.bool
};

export default function NodeItem({ nodeName, nodeURL, nodeStatus }) {
  return (
    <Grid container sx={{ height: '35px', textAlign: 'center' }}>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Typography
          variant="body1"
          sx={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'left', lineHeight: '35px' }}
        >
          {nodeName}
        </Typography>
      </Grid>
      <Grid item lg={8} md={8} sm={8} xs={8}>
        <Typography
          variant="body1"
          sx={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '35px' }}
        >
          {nodeURL}
        </Typography>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2} sx={{ height: '35px', lineHeight: '35px' }}>
        {nodeStatus ? (
          <Chip label="online" color="success" sx={{ height: '25px', color: 'white' }} />
        ) : (
          <Chip label="offline" sx={{ height: '25px' }} />
        )}
      </Grid>
    </Grid>
  );
}
