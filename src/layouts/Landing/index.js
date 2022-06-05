import { Outlet } from 'react-router-dom';
import Navbar from '../../components/hive/Navbar';

export default function HiveMainPage() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
