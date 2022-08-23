import { Navigate, useRoutes } from 'react-router-dom';
import LandingPage from '../pages/Landing';
import HiveHubLayout from '../layouts';
import HiveHome from '../pages/Dashboard/Home';
import HiveExplore from '../pages/Dashboard/Explore';
import HiveNodes from '../pages/Dashboard/MyNodes';
import HiveVaults from '../pages/Dashboard/MyVaults';
import CreateNode from '../pages/Dashboard/MyNodes/CreateNode';
import NodeDetail from '../pages/Dashboard/MyNodes/NodeDetail';
import NodeEnvConfig from '../pages/Dashboard/MyNodes/NodeEnvConfig';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <HiveHubLayout />,
      children: [
        { path: '', element: <Navigate to="/landing" replace /> },
        { path: 'landing', element: <LandingPage /> },
        {
          path: 'dashboard',
          children: [
            { path: '', element: <Navigate to="/dashboard/home" replace /> },
            { path: 'home', element: <HiveHome /> },
            { path: 'explore', element: <HiveExplore /> },
            { path: 'explore/detail/:nodeId', element: <NodeDetail /> },
            { path: 'nodes', element: <HiveNodes /> },
            { path: 'nodes/create', element: <CreateNode /> },
            { path: 'nodes/detail/:nodeId', element: <NodeDetail /> },
            { path: 'nodes/envconfig', element: <NodeEnvConfig /> },
            { path: 'vaults', element: <HiveVaults /> }
          ]
        }
      ]
    }
  ]);
}
