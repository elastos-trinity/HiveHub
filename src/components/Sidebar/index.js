import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Avatar, Stack, Tooltip, Box, Drawer } from '@mui/material';
import { Icon } from '@iconify/react';
import { tooltipClasses } from '@mui/material/Tooltip';
// components
import HiveLogo from '../Logo/Logo';
import Scrollbar from '../Scrollbar';
import { MHidden } from '../@material-extend';
import { useUserContext } from '../../contexts/UserContext';
import useConnectEE from '../../hooks/useConnectEE';

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

const activeLink = {
  color: '#FF931E'
};

const NavBox = styled(Box)({
  width: '100%',
  color: 'rgba(0, 0, 0, 0.3)',
  cursor: 'pointer'
});

const AccountStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: theme.spacing(2, 2, 2, 1.5),
  height: '62px'
}));

const UsernameTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    marginTop: '50 !important',
    fontSize: 13,
    borderRadius: 4
  }
}));

// ----------------------------------------------------------------------

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const { signOutWithEssentials } = useConnectEE();
  const [activeSection, setActiveSection] = useState(pathname.split('/')[1]); // value can be 'home' 'explore' 'nodes' 'vaults'
  // const theme = useTheme();
  // const matchMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!user.did) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    const segPath = pathname.split('/').filter((item) => item);
    if (segPath.length) setActiveSection(segPath[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const menuItemsList = [
    {
      title: 'My Nodes',
      path: '/dashboard/node',
      icon: 'mdi:hexagon-outline',
      label: 'node'
    },
    {
      title: 'Vault',
      path: '/dashboard/vault',
      icon: 'tabler:square-dot',
      label: 'vault'
    },
    {
      title: 'Explore',
      path: '/dashboard/explore',
      icon: 'mdi:hexagon-multiple-outline',
      label: 'explore'
    },
    {
      title: 'Settings',
      path: '/dashboard/settings',
      icon: 'tabler:settings',
      label: 'settings'
    },
    {
      title: 'Log out',
      path: '/',
      icon: 'mdi:logout',
      label: 'logout'
    }
  ];

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        background: '#131317',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Stack justifyContent="space-between">
        <AccountStyle
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 7, mb: 4, mx: 4, visibility: `${user.did ? 'block' : 'hidden'}` }}
        >
          <Avatar src={user.avatar} alt="photoURL" />
          <UsernameTooltip title={user.did || ''} placement="bottom-end">
            <Typography
              sx={{
                padding: 1,
                background: 'rgba(255, 147, 30, 0.1)',
                borderRadius: '30px',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '22px',
                width: '140px',
                color: '#FF931E',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.credentials?.name || user.did}
            </Typography>
          </UsernameTooltip>
        </AccountStyle>
        <Stack
          sx={{
            background: 'rgba(255, 147, 30, 0.1)',
            borderRadius: '30px',
            padding: 4,
            mx: 5
          }}
          spacing={1}
        >
          {menuItemsList.map((item, index) => (
            <NavBox
              key={`sidebar-menu-${index}`}
              onClick={() => {
                if (item.label !== 'logout') navigate(item.path);
                else signOutWithEssentials();
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing="15px"
                py={1}
              >
                <Icon
                  icon={item.icon}
                  fontSize={30}
                  color={activeSection === item.label ? '#FF931E' : '#FFF'}
                  rotate={item.label === 'explore' ? 3 : 0}
                />
                <Typography
                  sx={{
                    fontWeight: activeSection === item.label ? 700 : 400,
                    fontSize: '18px',
                    lineHeight: '28px',
                    color: '#FFF',
                    ...(activeSection === item.label && activeLink)
                  }}
                >
                  {item.title}
                </Typography>
              </Stack>
            </NavBox>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>
      <Box
        sx={{
          height: '120px',
          px: 2.5,
          py: 3,
          mx: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0
        }}
      >
        <HiveLogo mobile={Boolean(true)} />
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="mdUp">
        <Drawer open={isOpen} onClose={onClose}>
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
