import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Stack, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import HiveLogo from '../Logo/Logo';
import { MHidden } from '../@material-extend';
import { useUserContext } from '../../contexts/UserContext';

TopNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function TopNavbar({ onOpenSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (pathname.includes('dashboard') && !user.did) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user.did]);

  return (
    <Box>
      <MHidden width="mdDown">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '120px',
            background: '#1D1F21',
            zIndex: 100
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            mx={{ md: 5, lg: 7.5 }}
          >
            <HiveLogo />
          </Stack>
        </Box>
      </MHidden>
      <MHidden width="mdUp">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '120px',
            background: '#1D1F21',
            zIndex: 100
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="100%"
            width="90%"
            sx={{ margin: '0 auto' }}
          >
            <IconButton
              onClick={onOpenSidebar}
              sx={{ mr: 1, color: '#FFFFFF', position: 'absolute', left: '20px' }}
            >
              <Icon icon={menu2Fill} />
            </IconButton>
            <HiveLogo mobile={Boolean(true)} />
          </Stack>
        </Box>
      </MHidden>
    </Box>
  );
}
