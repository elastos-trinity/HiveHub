import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
// components
import React, { useContext, useEffect, useState } from 'react';
import HiveLogo from '../../components/hive/HiveLogo';
import Scrollbar from '../../components/Scrollbar';
import { MHidden } from '../../components/@material-extend';
import SmallHexagon from '../../components/SmallHexagon';
import UserContext from '../../contexts/UserContext';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 320;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 2, 1.5),
  height: '62px',
  borderRadius: '31px',
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

HiveDashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
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

export default function HiveDashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'

  useEffect(() => {
    if (!user.did) {
      navigate('/', { replace: true });
    }

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
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex', textDecoration: 'none' }}>
          <HiveLogo />
        </Box>
      </Box>

      <Box sx={{ my: 12, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src="/static/mock-images/avatars/avatar_default.jpg" alt="photoURL" />
            <Box sx={{ ml: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography variant="subtitle1" sx={{ color: '#FF931E' }}>
                {user.did}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <Stack sx={{ mx: 2.5, mt: 4 }} spacing="">
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

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ p: 2.5, pt: 5, position: 'relative' }}>
          <Link href="https://github.com" target="_blank">
            <Box component="img" src="/static/illustrations/github.png" sx={{ width: 90 }} />
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
