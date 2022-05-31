import { Outlet } from 'react-router-dom';
import Navigator from '../components/_dashboard/hive/Navigator';

export default function HiveMainPage() {
  return (
    <>
      <Navigator />
      <Outlet />
    </>
  );
}
