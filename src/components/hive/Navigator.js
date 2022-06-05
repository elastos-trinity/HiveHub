import { Box, Grid, Link } from '@mui/material';
import * as React from 'react';
import HiveLogo from './HiveLogo';
import WebAppBackground from '../WebAppBackground';
import LanguageBar from '../LanguageBar';
import palette from '../../theme/palette';

export default function Navigator() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <WebAppBackground />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          height: '120px',
          backgroundColor: palette.common.white,
          zIndex: 1
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
    </>
  );
}
