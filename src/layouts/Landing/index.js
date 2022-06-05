import { Outlet } from 'react-router-dom';
import Navigator from '../../components/hive/Navigator';

export default function HiveMainPage() {
  return (
    <>
      <Navigator />
      <Outlet />
    </>
  );
}
