import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useUserContext } from '../../contexts/UserContext';
import UserAvatar from '../UserAvatar';
import LanguageBar from '../LanguageBar';
import generatedGitInfo from '../../generatedGitInfo.json';
import { config } from '../../config';

// ----------------------------------------------------------------------

const DRAWER_WIDTH_LG = 320;
const DRAWER_WIDTH_MD = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH_MD
  },
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH_LG
  }
}));

// ----------------------------------------------------------------------

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

const activeLink = {
  color: 'black'
};

const NavBox = styled(Box)({
  width: '100%',
  color: 'rgba(0, 0, 0, 0.3)',
  cursor: 'pointer'
});

export default function Sidebar({ isOpenSidebar, onCloseSidebar }) {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState(pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'
  const theme = useTheme();
  const matchMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const showAvatar = !(pathname.includes('dashboard') && matchMdUp);
  const showMenu = user.did && pathname.includes('dashboard') && matchMdUp;

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
      <Box
        sx={{
          height: '120px',
          px: 2.5,
          py: 3,
          mx: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <HiveLogo mobile={Boolean(true)} />
      </Box>
      <Stack justifyContent="space-between">
        {showAvatar && (
          <Box sx={{ pb: 7.5, px: 2.5, mt: 2.5, visibility: `${user.did ? 'block' : 'hidden'}` }}>
            <UserAvatar />
          </Box>
        )}
        {showMenu && (
          <Stack sx={{ padding: 2.5, mt: 3 }} spacing={1}>
            {menuItemsList.map((item, index) => (
              <NavBox key={`sidebar-menu-${index}`} onClick={() => navigate(item.path)}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing="15px"
                  ml={{ lg: '70px', md: '50px' }}
                  py={4}
                >
                  <Icon
                    icon={activeSection === item.label ? item.iconActive : item.icon}
                    fontSize={30}
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
        )}
        <LanguageBar sx={{ padding: 5, mt: showMenu ? 3 : 15 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ px: 0, pb: 2, mt: showMenu ? 3 : 15 }}>
          <Stack alignItems="center" spacing={2.5} sx={{ py: 2.5, position: 'relative' }}>
            <Link href={config.GitHubRepo} target="_blank">
              <Box component="img" src="/static/github.svg" sx={{ width: 40 }} />
            </Link>
            <Stack
              spacing={1}
              sx={{ textAlign: 'center' }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                sx={{
                  fontSize: '15px',
                  lineHeight: '50px',
                  fontWeight: 400,
                  fontFamily: 'Red Hat Display',
                  color: '#000'
                }}
              >
                @ 2022 Trinity Tech Ltd.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#1890FF',
                  paddingX: 1,
                  paddingY: 0.5,
                  borderRadius: 2,
                  background: '#E8F4FF'
                }}
              >
                v1 - {generatedGitInfo.gitCommitHash}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="mdUp">
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar}>
          {renderContent}
        </Drawer>
      </MHidden>
      {pathname.includes('dashboard') && (
        <MHidden width="mdDown">
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: { md: DRAWER_WIDTH_MD, lg: DRAWER_WIDTH_LG },
                backgroundColor: 'background.default',
                borderRight: 'none',
                zIndex: 50
              }
            }}
          >
            {renderContent}
          </Drawer>
        </MHidden>
      )}
    </RootStyle>
  );
}
