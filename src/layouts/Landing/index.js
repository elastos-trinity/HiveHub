import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/TopNavbar';

export default function HiveMainPage() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
