import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import MainLayout from '../layouts/MainLayout';
import SettingLayout from '../layouts/SettingLayout';

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
                { path: 'create', element: <CreateNodePage /> },
                { path: 'detail/:nodeId', element: <MyNodeDetail /> },
                { path: 'public/:nodeId', element: <PublicNodeDetail /> }
              ]
            },
            {
              path: 'vault',
              children: [{ path: '', element: <MyVault /> }]
            },
            {
              path: 'explore',
              children: [{ path: '', element: <ExploreNode /> }]
            },
            {
              path: 'settings',
              element: <SettingLayout />,
              children: [
                { path: '', element: <Navigate to="/dashboard/settings/about" replace /> },
                { path: 'about', element: <AboutSettings /> },
                { path: 'language', element: <LanguageSettings /> }
              ]
            }
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
const MyNodeDetail = Loadable(lazy(() => import('../pages/Dashboard/Node/NodeDetail')));
const PublicNodeDetail = Loadable(lazy(() => import('../pages/Dashboard/Node/PublicNodeDetail')));
const MyVault = Loadable(lazy(() => import('../pages/Dashboard/Vault')));
const ExploreNode = Loadable(lazy(() => import('../pages/Dashboard/Explore')));
const AboutSettings = Loadable(lazy(() => import('../pages/Dashboard/Settings/About')));
const LanguageSettings = Loadable(lazy(() => import('../pages/Dashboard/Settings/Language')));
