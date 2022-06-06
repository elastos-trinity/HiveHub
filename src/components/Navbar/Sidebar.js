import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Link, Drawer, Typography, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
// components
import HiveLogo from '../Logo';
import Scrollbar from '../Scrollbar';
import { MHidden } from '../@material-extend';
import UserContext from '../../contexts/UserContext';
import UserAvatar from '../UserAvatar';
import LanguageBar from '../LanguageBar';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 320;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

// ----------------------------------------------------------------------

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  handleLanguageChange: PropTypes.func
};

const activeLink = {
  color: 'black'
};

const NavBox = styled(Box)({
  width: '100%',
  height: '80px',
  margin: '10px auto',
  textAlign: 'left',
  color: 'rgba(0, 0, 0, 0.3)'
});

export default function Sidebar({ isOpenSidebar, onCloseSidebar }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState(pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'
  const theme = useTheme();
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    setActiveSection(pathname.split('/')[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const menuItemsList = [
    {
      title: 'Home',
      path: '/dashboard/home',
      icon: 'bx:home-alt-2',
      iconActive: 'bxs:home-alt-2',
      label: 'home'
    },
    {
      title: 'Explore',
      path: '/dashboard/explore',
      icon: 'mdi:hexagon-multiple-outline',
      iconActive: 'mdi:hexagon-multiple',
      label: 'explore'
    },
    {
      title: 'My Nodes',
      path: '/dashboard/nodes',
      icon: 'mdi:hexagon-outline',
      iconActive: 'mdi:hexagon',
      label: 'nodes'
    },
    {
      title: 'My Vaults',
      path: '/dashboard/vaults',
      icon: 'tabler:square-dot',
      iconActive: 'tabler:square-dot',
      label: 'vaults'
    }
  ];

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3, mx: '20px' }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex', textDecoration: 'none' }}>
          <HiveLogo />
        </Box>
      </Box>

      {(!pathname.includes('dashboard') || matchSmDown) && (
        <Box sx={{ my: 12, mx: 2.5, visibility: `${user.did ? 'block' : 'hidden'}` }}>
          <UserAvatar did={user.did} avatar="/static/mock-images/avatars/avatar_default.jpg" />
        </Box>
      )}
      {user.did && pathname.includes('dashboard') && (
        <MHidden width="smDown">
          <Stack sx={{ mx: 2.5, mt: 4 }} spacing={1}>
            {menuItemsList.map((item, index) => (
              <NavBox
                key={`sidebar-menu-${index}`}
                onClick={() => navigate(item.path)}
                sx={{ cursor: 'pointer' }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing="15px"
                  ml="70px"
                >
                  <Icon
                    icon={activeSection === item.label ? item.iconActive : item.icon}
                    fontSize={50}
                    color={activeSection === item.label ? 'black' : 'rgba(0, 0, 0, 0.3)'}
                    rotate={item.label === 'explore' ? 3 : 0}
                  />
                  <Typography variant="h5" sx={{ ...(activeSection === item.label && activeLink) }}>
                    {item.title}
                  </Typography>
                </Stack>
              </NavBox>
            ))}
          </Stack>
        </MHidden>
      )}
      <LanguageBar sx={{ mt: `${matchSmDown ? '13rem' : '6rem'}` }} />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 2.5, pb: 3, mt: `${matchSmDown ? '10rem' : '2rem'}` }}>
        <Stack alignItems="center" spacing={3} sx={{ p: 2.5, pt: 5, position: 'relative' }}>
          <Link href="https://github.com/elastos/Elastos.Hive.Node" target="_blank">
            <Box component="img" src="/static/illustrations/github.png" sx={{ width: 50 }} />
          </Link>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              @ 2022 Trinity Tech Ltd.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              backgroundColor: 'background.default',
              borderRight: 'none',
              boxShadow: '10px 0px 20px rgba(255, 147, 30, 0.2)'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
