import React from 'react';
import PropTypes from 'prop-types';
import { Stack, LinearProgress, Skeleton, Typography, Box, Grid } from '@mui/material';
import { LabelTypo, NormalTypo } from '../Custom/CustomTypos';
import { reduceHexAddress } from '../../service/common';

DappVaultGrid.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  appDid: PropTypes.string,
  used: PropTypes.number,
  total: PropTypes.number,
  isLoading: PropTypes.bool,
  innerSx: PropTypes.object
};

const dappList = [
  {
    name: '???',
    appDid: '---',
    avatar: '/static/dapp/ic_unknown.svg'
  },
  {
    name: 'HiveHub',
    appDid: 'did:elastos:ik3ngW1tRxzTtwRstgkCWuv4SmUQ6nGcML',
    avatar: '/static/dapp/ic_hivehub.svg'
  },
  {
    name: 'Pasar',
    appDid: 'did:elastos:iZvAak2SUHaKwBHmPFsgtVVMGtTpi4r2kY',
    avatar: '/static/dapp/ic_pasar.svg'
  },
  {
    name: 'Feeds',
    appDid: 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg',
    avatar: '/static/dapp/ic_feeds.svg'
  }
];

export default function DappVaultGrid({
  avatar,
  name,
  appDid,
  used,
  total,
  isLoading,
  innerSx = {}
}) {
  if (!name || !avatar) {
    const id = dappList.findIndex((el) => el.appDid === appDid);
    const dappId = id < 0 ? 0 : id;
    if (dappId === 0 && appDid) name = reduceHexAddress(appDid, 10);
    else name = dappList[dappId].name;
    avatar = dappList[dappId].avatar;
  }

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
            <NormalTypo sx={{ fontWeight: 600, color: '#FFF' }} noWrap>
              {name || reduceHexAddress(appDid, 6)}
            </NormalTypo>
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
