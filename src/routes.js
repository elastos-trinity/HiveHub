import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import Login from './pages/Login';
// import Register from './pages/Register';
// import DashboardApp from './pages/DashboardApp';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
// import User from './pages/User';
// import NotFound from './pages/Page404';
import LandingPage from './pages/Landing';
import HiveMainPage from './layouts/Landing';
import HiveDashboard from './layouts/Dashboard';
import HiveHome from './pages/Dashboard/Home';
import HiveExplore from './pages/Dashboard/Explore';
import HiveNodes from './pages/Dashboard/MyNodes';
import HiveVaults from './pages/Dashboard/MyVaults';
import CreateNode from './pages/Dashboard/MyNodes/CreateNode';
import NodeDetail from './pages/Dashboard/MyNodes/NodeDetail';
import NodeEnvConfig from './pages/Dashboard/MyNodes/NodeEnvConfig';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <HiveMainPage />,
      children: [
        { path: '', element: <Navigate to="/landing" replace /> },
        { path: 'landing', element: <LandingPage /> }
      ]
    },
    {
      path: '/dashboard',
      element: <HiveDashboard />,
      children: [
        { path: '', element: <Navigate to="/dashboard/home" replace /> },
        { path: 'home', element: <HiveHome /> },
        { path: 'explore', element: <HiveExplore /> },
        { path: 'nodes', element: <HiveNodes /> },
        { path: 'nodes/create', element: <CreateNode /> },
        { path: 'nodes/detail/:nodeId', element: <NodeDetail /> },
        { path: 'nodes/envconfig', element: <NodeEnvConfig /> },
        { path: 'vaults', element: <HiveVaults /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
