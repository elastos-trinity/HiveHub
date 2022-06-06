import React, { useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Link, Stack, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import HiveLogo from '../Logo';
import LanguageBar from '../LanguageBar';
import UserAvatar from '../UserAvatar';
import palette from '../../theme/palette';
import { MHidden } from '../@material-extend';
import UserContext from '../../contexts/UserContext';

TopNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function TopNavbar({ onOpenSidebar }) {
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);

  return (
    <>
      <MHidden width="smDown">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '150px',
            backgroundColor: palette.common.white,
            zIndex: 111
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            width="90%"
            sx={{ margin: '0 auto' }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'inline-flex', textDecoration: 'none' }}
            >
              <HiveLogo />
            </Box>
            {user.did && pathname.includes('dashboard') ? (
              <UserAvatar did={user.did} avatar="/static/mock-images/avatars/avatar_default.jpg" />
            ) : (
              <LanguageBar />
            )}
          </Stack>
        </Box>
      </MHidden>

      <MHidden width="smUp">
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '150px',
            backgroundColor: palette.common.white,
            zIndex: 111
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
              sx={{ mr: 1, color: 'text.primary', position: 'absolute', left: '20px' }}
            >
              <Icon icon={menu2Fill} />
            </IconButton>
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'inline-flex', textDecoration: 'none' }}
            >
              <HiveLogo />
            </Box>
          </Stack>
        </Box>
      </MHidden>
    </>
  );
}
