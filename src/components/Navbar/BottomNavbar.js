import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack, Typography, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import palette from '../../theme/palette';
import { MHidden } from '../@material-extend';
import UserContext from '../../contexts/UserContext';

BottomNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

const activeLink = {
  color: 'black'
};

const NavButton = styled(Button)({
  width: '100%',
  height: '80px',
  textAlign: 'center',
  color: 'rgba(0, 0, 0, 0.3)'
});

export default function BottomNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState(pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'
  const matchXsDown = useMediaQuery('(max-width:450px)');

  useEffect(() => {
    if (pathname.includes('dashboard') && !user.did) navigate('/');
    setActiveSection(pathname.split('/')[2]);
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
        <MHidden width="mdUp">
          <Stack
            direction="row"
            sx={{
              position: 'fixed',
              width: '100%',
              left: '0px',
              bottom: '0px',
              padding: '20px',
              backgroundColor: palette.common.white,
              zIndex: 111
            }}
            spacing={1}
          >
            {menuItemsList.map((item, index) => (
              <NavButton
                key={`sidebar-menu-${index}`}
                onClick={() => navigate(item.path)}
                sx={{ cursor: 'pointer', justifyContent: 'center' }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Icon
                    icon={activeSection === item.label ? item.iconActive : item.icon}
                    fontSize={matchXsDown ? 30 : 50}
                    color={activeSection === item.label ? 'black' : 'rgba(0, 0, 0, 0.3)'}
                    rotate={item.label === 'explore' ? 3 : 0}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: matchXsDown ? '10px' : '1rem',
                      ...(activeSection === item.label && activeLink)
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>
              </NavButton>
            ))}
          </Stack>
        </MHidden>
      )}
    </div>
  );
}
