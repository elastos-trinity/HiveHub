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
import HiveNodes from './pages/Dashboard/MyNodes';
import HiveVaults from './pages/Dashboard/MyVaults';
import HiveNodeAdd from './pages/Dashboard/MyNodes/HiveNodeAdd';
import HiveNodeDetail from './pages/Dashboard/MyNodes/HiveNodeDetail';
import HiveExplore from './pages/Dashboard/Explore';

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
