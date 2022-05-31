import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import LandingPage from './components/_dashboard/hive/LandingPage';
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
import HiveMainPage from './layouts/HiveMainPage';
import HiveDashboard from './layouts/HiveDashboard';
import HiveHome from './pages/HiveHome';
import HiveNodes from './pages/HiveNodes';
import HiveVaults from './pages/HiveVaults';
import HiveNodeAdd from './pages/HiveNodeAdd';
import HiveNodeDetail from './pages/HiveNodeDetail';

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
        { path: 'nodes', element: <HiveNodes /> },
        { path: 'nodes/add', element: <HiveNodeAdd /> },
        { path: 'nodes/detail/:nodeId', element: <HiveNodeDetail /> },
        { path: 'vaults', element: <HiveVaults /> }
      ]
    },
    // {
    //   path: '/minimal/dashboard',
    //   element: <DashboardLayout />,
    //   children: [
    //     { element: <Navigate to="/minimal/dashboard/app" replace /> },
    //     { path: 'app', element: <DashboardApp /> },
    //     { path: 'user', element: <User /> },
    //     { path: 'products', element: <Products /> },
    //     { path: 'blog', element: <Blog /> }
    //   ]
    // },
    // {
    //   path: '/minimal/',
    //   element: <LogoOnlyLayout />,
    //   children: [
    //     { path: 'login', element: <Login /> },
    //     { path: 'register', element: <Register /> },
    //     { path: '404', element: <NotFound /> },
    //     { path: '/', element: <Navigate to="/minimal/dashboard" /> },
    //     { path: '*', element: <Navigate to="/404" /> }
    //   ]
    // },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
