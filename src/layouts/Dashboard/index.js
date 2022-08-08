import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopNavbar from '../../components/Navbar/TopNavbar';
import Sidebar from '../../components/Navbar/Sidebar';
import BottomNavbar from '../../components/Navbar/BottomNavbar';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  position: 'relative',
  background: 'rgba(255, 147, 30, 0.3)'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(12),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
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

export default function HiveDashboard() {
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <Box
        component="img"
        src="/static/bg_hexagon.svg"
        sx={{ position: 'absolute', top: 0, bottom: 0, margin: 'auto', zIndex: 0 }}
      />
      <TopNavbar onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
      <BottomNavbar />
    </RootStyle>
  );
}