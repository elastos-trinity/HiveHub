import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import MainLayout from '../layouts/MainLayout';
// unused
import HiveHubLayout from '../layouts';

// ----------------------------------------------------------------------
const Loadable = (Component) =>
  function loadPage(props) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <HomePage /> },
        {
          path: 'dashboard',
          children: [
            { path: '', element: <Navigate to="/dashboard/node" replace /> },
            {
              path: 'node',
              children: [
                { path: '', element: <MyNodes /> },
                { path: 'envconfig', element: <EnvConfigPage /> },
                { path: 'create', element: <CreateNodePage /> }
              ]
            }
            // { path: 'explore', element: <HiveExplore /> },
            // { path: 'explore/detail/:nodeId', element: <NodeDetail /> },
            // { path: 'nodes', element: <HiveNodes /> },
            // { path: 'nodes/detail/:nodeId', element: <MyNodeDetail /> },
            // { path: 'nodes/envconfig', element: <NodeEnvConfig /> },
            // { path: 'nodes/create', element: <CreateNode /> },
            // { path: 'vaults', element: <HiveVaults /> }
          ]
        }
      ]
    },
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

const HomePage = Loadable(lazy(() => import('../pages/Home')));
const MyNodes = Loadable(lazy(() => import('../pages/Dashboard/Node')));
const EnvConfigPage = Loadable(lazy(() => import('../pages/Dashboard/Node/EnvConfiguration')));
const CreateNodePage = Loadable(lazy(() => import('../pages/Dashboard/Node/CreateNode')));
// unused
const LandingPage = Loadable(lazy(() => import('../pages/Landing')));
const HiveHome = Loadable(lazy(() => import('../pages/Dashboard/Home')));
const HiveExplore = Loadable(lazy(() => import('../pages/Dashboard/Explore')));
const NodeDetail = Loadable(lazy(() => import('../pages/Dashboard/Explore/NodeDetail')));
const HiveNodes = Loadable(lazy(() => import('../pages/Dashboard/MyNodes')));
const MyNodeDetail = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/MyNodeDetail')));
const NodeEnvConfig = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/NodeEnvConfig')));
const CreateNode = Loadable(lazy(() => import('../pages/Dashboard/MyNodes/CreateNode')));
const HiveVaults = Loadable(lazy(() => import('../pages/Dashboard/MyVaults')));
