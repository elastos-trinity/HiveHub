import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopNavbar from '../components/Navbar/TopNavbar';
import Sidebar from '../components/Navbar/Sidebar';
import BottomNavbar from '../components/Navbar/BottomNavbar';
import useInitializeEE from '../hooks/useInitializeEE';

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

export default function MainLayout() {
  const location = useLocation();
  useInitializeEE();
  const [open, setOpen] = useState(false);
  const isLandingPage = location.pathname === '/landing';

  return (
    <Box
      sx={{
        display: isLandingPage ? 'block' : 'flex',
        minHeight: '100%',
        position: 'relative',
        background: '#1D1F21',
        overflow: 'hidden'
      }}
    >
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      {isLandingPage ? (
        <>
          <TopNavbar onOpenSidebar={() => setOpen(true)} />
          <Outlet />
        </>
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
