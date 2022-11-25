import React from 'react';
import PropTypes from 'prop-types';
import { Stack, LinearProgress, Skeleton, Typography, Box, Grid } from '@mui/material';
import { LabelTypo, NormalTypo } from '../Custom/CustomTypos';

DappVaultGrid.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  used: PropTypes.number,
  total: PropTypes.number,
  isLoading: PropTypes.bool,
  innerSx: PropTypes.object
};

export default function DappVaultGrid({ avatar, name, used, total, isLoading, innerSx = {} }) {
  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      {isLoading ? (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            ...innerSx
          }}
        >
          <Typography component="div" variant="h4" width="30%">
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6" width="30%" sx={{ mb: 3 }}>
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6">
            <Skeleton animation="wave" />
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            ...innerSx
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={avatar} alt="dapp_avatar" width="30px" />
            <NormalTypo sx={{ fontWeight: 600, color: '#FFF' }}>{name}</NormalTypo>
          </Stack>
          <LabelTypo my={2}>{used} MB used</LabelTypo>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'end', sm: 'center' }}
            spacing={{ xs: 2, sm: 5 }}
          >
            <LinearProgress
              variant="determinate"
              value={(used / total ?? 0) * 100}
              color="warning"
              sx={{
                height: '10px',
                borderRadius: '100px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </Stack>
        </Box>
      )}
    </Grid>
  );
}
