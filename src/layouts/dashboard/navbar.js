import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Box, Avatar, Link, Typography } from '@mui/material';
import HiveLogo from '../../components/hive/HiveLogo';
import { MHidden } from '../../components/@material-extend';
import LanguageBar from '../../components/LanguageBar';
import UserContext from '../../contexts/UserContext';
// components

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  // backgroundColor: alpha(theme.palette.background.default, 0.72),
  backgroundColor: 'transparent',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
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

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

HiveDashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function HiveDashboardNavbar({ onOpenSidebar }) {
  const { user } = useContext(UserContext);

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
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
        <Box sx={{ margin: '0 20px 0 auto' }}>
          <LanguageBar />
        </Box>
      </ToolbarStyle>
    </RootStyle>
  );
}
