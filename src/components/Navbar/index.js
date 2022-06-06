import React, { useContext } from 'react';
import { Box, Grid, Link, Typography, Avatar, Stack } from '@mui/material';
import HiveLogo from '../hive/HiveLogo';
import WebAppBackground from '../WebAppBackground';
import LanguageBar from '../LanguageBar';
import UserAvatar from '../UserAvatar';
import palette from '../../theme/palette';
import { MHidden } from '../@material-extend';
import UserContext from '../../contexts/UserContext';

export default function Navbar() {
  const { user } = useContext(UserContext);

  return (
    <>
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <WebAppBackground />
      </Box> */}
      <MHidden width="smDown">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '120px',
            backgroundColor: palette.common.white,
            zIndex: 111
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            width="90%"
            sx={{ margin: '0 auto' }}
          >
            <Link href="/" sx={{ textDecoration: 'none' }}>
              <HiveLogo />
            </Link>
            {user.did ? (
              <UserAvatar did={user.did} avatar="/static/mock-images/avatars/avatar_default.jpg" />
            ) : (
              <LanguageBar />
            )}
          </Stack>
        </Box>
      </MHidden>

      {/* <MHidden width="smUp">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '120px',
            backgroundColor: palette.common.white,
            zIndex: 111
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            width="90%"
            sx={{ margin: '0 auto' }}
          >
            <Grid item xs={2}>
              <Link href="/" sx={{ textDecoration: 'none' }}>
                <HiveLogo />
              </Link>
            </Grid>
            <Grid item xs={1}>
              <LanguageBar />
            </Grid>
          </Grid>
        </Box>
      </MHidden> */}
    </>
  );
}
