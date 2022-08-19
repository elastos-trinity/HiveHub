import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopNavbar from '../components/Navbar/TopNavbar';
import Sidebar from '../components/Navbar/Sidebar';
import BottomNavbar from '../components/Navbar/BottomNavbar';
import useConnectEE from '../hooks/useConnectEE';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(12),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  position: 'relative',
  zIndex: 10,
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(6),
    paddingBottom: theme.spacing(8)
  },
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(12)
  },
  [theme.breakpoints.up('xl')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingBottom: theme.spacing(12),
    paddingLeft: theme.spacing(12),
    paddingRight: theme.spacing(18)
  }
}));

export default function HiveHubLayout() {
  const location = useLocation();
  useConnectEE(); // must
  const [open, setOpen] = useState(false);
  const isLandingPage = location.pathname === '/landing';

  return (
    <Box
      sx={{
        display: isLandingPage ? 'block' : 'flex',
        minHeight: '100%',
        position: 'relative',
        background: 'rgba(255, 147, 30, 0.07)',
        overflow: 'hidden'
      }}
    >
      <Box
        component="img"
        src="/static/bg_hexagon.svg"
        sx={{
          position: 'absolute',
          top: { xs: '-250vw', sm: '-80vw', md: '-25vw' },
          bottom: 0,
          margin: 'auto',
          zIndex: 0
        }}
      />
      <TopNavbar onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      {isLandingPage ? (
        <Outlet />
      ) : (
        <>
          <MainStyle>
            <Outlet />
          </MainStyle>
          <BottomNavbar />
        </>
      )}
    </Box>
  );
}
