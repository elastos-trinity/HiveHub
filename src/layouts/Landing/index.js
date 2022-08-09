import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import TopNavbar from '../../components/Navbar/TopNavbar';
import Sidebar from '../../components/Navbar/Sidebar';

export default function HiveMainPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative', background: 'rgba(255, 147, 30, 0.07)', overflow: 'hidden' }}>
      <Box
        component="img"
        src="/static/bg_hexagon.svg"
        sx={{ position: 'absolute', top: 0, bottom: 0, margin: 'auto', zIndex: 0 }}
      />
      <TopNavbar onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <Outlet />
    </Box>
  );
}
