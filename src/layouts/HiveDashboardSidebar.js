import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
// components
import React, { useContext, useEffect, useState } from 'react';
import HiveLogo from '../components/_dashboard/hive/HiveLogo';
import Scrollbar from '../components/Scrollbar';
import { MHidden } from '../components/@material-extend';
import SmallHexagon from '../components/SmallHexagon';
import UserContext from '../contexts/UserContext';

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
  const [activeSection, setActiveSection] = React.useState(location.pathname.split('/')[2]); // value can be 'home' 'nodes' 'vaults'

  useEffect(() => {
    if (!user.did) {
      navigate('/', { replace: true });
    }

    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

      <Stack sx={{ mx: 2.5, mt: 4 }}>
        <Link href="/dashboard/home" sx={{ textDecoration: 'none' }}>
          <NavBox>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Box sx={{ position: 'relative', top: '-35px', marginRight: '15px' }}>
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    border: '22px solid transparent',
                    borderBottom: `22px solid ${
                      activeSection === 'home' ? 'black' : 'rgba(0, 0, 0, 0.3)'
                    }`,
                    position: 'relative',
                    top: '40px'
                  }}
                />
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    border: '18px solid transparent',
                    borderBottom: `18px solid ${
                      activeSection === 'home' ? 'transparent' : 'white'
                    }`,
                    position: 'relative',
                    top: '2px',
                    left: '3.7px'
                  }}
                />
                <Box
                  sx={{
                    width: '30px',
                    height: '20px',
                    border: `2px solid ${
                      activeSection === 'home' ? 'black' : 'rgba(0, 0, 0, 0.3)'
                    }`,
                    borderTop: 'none',
                    margin: '0 auto',
                    backgroundColor: `${activeSection === 'home' ? 'black' : 'white'}`
                  }}
                />
              </Box>
              <Typography variant="h5" sx={{ ...(activeSection === 'home' && activeLink) }}>
                Home
              </Typography>
            </Stack>
          </NavBox>
        </Link>
        <Link href="/dashboard/nodes" sx={{ textDecoration: 'none' }}>
          <NavBox>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'relative', top: '15px', left: '20px' }}
            >
              <Box sx={{ position: 'relative', top: '3px', marginRight: '15px' }}>
                <SmallHexagon
                  borderColor={activeSection === 'nodes' ? 'black' : 'rgba(0, 0, 0, 0.3)'}
                  rootHexagon
                  sideLength={20}
                  borderWidth={2}
                  backColor={activeSection === 'nodes' ? 'black' : 'transparent'}
                />
              </Box>
              <Typography variant="h5" sx={{ ...(activeSection === 'nodes' && activeLink) }}>
                My Nodes
              </Typography>
            </Stack>
          </NavBox>
        </Link>
        <Link href="/dashboard/vaults" sx={{ textDecoration: 'none' }}>
          <NavBox>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'relative', left: '20px' }}
            >
              <Box sx={{ marginRight: '15px' }}>
                <Box
                  sx={{
                    width: '35px',
                    height: '35px',
                    margin: '0 auto',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    border: `2px solid ${
                      activeSection === 'vaults' ? 'black' : 'rgba(0, 0, 0, 0.3)'
                    }`,
                    backgroundColor: `${activeSection === 'vaults' ? 'black' : 'transparent'}`
                  }}
                >
                  <Box
                    sx={{
                      color: '#FF931E',
                      height: '10px',
                      width: '10px',
                      margin: '0 auto',
                      borderRadius: '10px',
                      backgroundColor: `${activeSection === 'vaults' ? 'black' : 'transparent'}`,
                      border: `2px solid ${
                        activeSection === 'vaults' ? 'white' : 'rgba(0, 0, 0, 0.3)'
                      }`
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="h5" sx={{ ...(activeSection === 'vaults' && activeLink) }}>
                My Vaults
              </Typography>
            </Stack>
          </NavBox>
        </Link>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            position: 'relative'
          }}
        >
          <Box component="img" src="/static/illustrations/github.png" sx={{ width: 90 }} />

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
