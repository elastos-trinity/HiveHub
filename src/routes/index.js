import { Navigate, useRoutes } from 'react-router-dom';
import LandingPage from '../pages/Landing';
import HiveHubLayout from '../layouts';
import HiveHome from '../pages/Dashboard/Home';
import HiveExplore from '../pages/Dashboard/Explore';
import NodeDetail from '../pages/Dashboard/Explore/NodeDetail';
import HiveNodes from '../pages/Dashboard/MyNodes';
import MyNodeDetail from '../pages/Dashboard/MyNodes/MyNodeDetail';
import NodeEnvConfig from '../pages/Dashboard/MyNodes/NodeEnvConfig';
import CreateNode from '../pages/Dashboard/MyNodes/CreateNode';
import HiveVaults from '../pages/Dashboard/MyVaults';

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
            { path: 'nodes/detail/:nodeId', element: <MyNodeDetail /> },
            { path: 'nodes/envconfig', element: <NodeEnvConfig /> },
            { path: 'nodes/create', element: <CreateNode /> },
            { path: 'vaults', element: <HiveVaults /> }
          ]
        }
      ]
    }
  ]);
}
