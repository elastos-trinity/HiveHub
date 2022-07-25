import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Typography,
  Avatar,
  Stack,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@mui/material';
import useUser from '../hooks/useUser';
import {
  fetchHiveScriptPictureToDataUrl,
  getHiveAvatarUrlFromDIDAvatarCredential
} from '../service/fetch';

export const AccountStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: theme.spacing(2, 2, 2, 1.5),
  height: '62px',
  borderRadius: '31px',
  backgroundColor: theme.palette.grey[200]
}));

export default function UserAvatar() {
  const { user, signOutWithEssentials } = useUser();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const getAvatarUrl = async () => {
      const hiveAvatarUrl = getHiveAvatarUrlFromDIDAvatarCredential(user.credentials.avatar);
      const avatarUrl = await fetchHiveScriptPictureToDataUrl(hiveAvatarUrl, user.did);
      setAvatar(avatarUrl);
    };
    if (user.did && user.credentials.avatar) getAvatarUrl();
  }, [user.did, user.credentials]);
  
  return (
    <AccountStyle direction="row" spacing={1} justifyContent="center">
      <Avatar src={avatar} alt="photoURL" />
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ color: 'black' }}
      >
        <Typography
          variant="subtitle1"
          sx={{ width: '120px', color: '#FF931E', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {user.did}
        </Typography>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem
                    onClick={(event) => {
                      signOutWithEssentials();
                      handleClose(event);
                    }}
                  >
                    Log out
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </AccountStyle>
  );
}
