import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Stack, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import HiveLogo from '../Logo';
import LanguageBar from '../LanguageBar';
import UserAvatar from '../UserAvatar';
import palette from '../../theme/palette';
import { MHidden } from '../@material-extend';
import UserContext from '../../contexts/UserContext';

BottomNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
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

export default function BottomNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState(pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'

  useEffect(() => {
    if (pathname.includes('dashboard') && !user.did) navigate('/');
  }, [pathname, user]);

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

  return (
    <div>
      {user.did && pathname.includes('dashboard') && (
        <MHidden width="lgUp">
          <Stack
            direction="row"
            sx={{
              position: 'fixed',
              width: '100%',
              height: '75px',
              left: '0px',
              bottom: '0px',
              backgroundColor: palette.common.white,
              zIndex: 111
            }}
            spacing={1}
          >
            {menuItemsList.map((item, index) => (
              <NavBox
                key={`sidebar-menu-${index}`}
                onClick={() => navigate(item.path)}
                sx={{ cursor: 'pointer' }}
              >
                <Stack alignItems="center" justifyContent="flex-start" spacing="15px" ml="70px">
                  <Icon
                    icon={activeSection === item.label ? item.iconActive : item.icon}
                    fontSize={50}
                    color={activeSection === item.label ? 'black' : 'rgba(0, 0, 0, 0.3)'}
                    rotate={item.label === 'explore' ? 3 : 0}
                  />
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: 600,
                      ...(activeSection === item.label && activeLink)
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>
              </NavBox>
            ))}
          </Stack>
        </MHidden>
      )}
    </div>
  );
}
