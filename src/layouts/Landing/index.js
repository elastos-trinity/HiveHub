import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../../components/Navbar/TopNavbar';
import Sidebar from '../../components/Navbar/Sidebar';

export default function HiveMainPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TopNavbar onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <Outlet />
    </>
  );
}
