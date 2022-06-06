import * as React from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@mui/material';

export default function LanguageBar() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('English');
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (event, value) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setActive(value);
    setOpen(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // function handleListKeyDown(event) {
  //   if (event.key === 'Tab') {
  //     event.preventDefault();
  //     setOpen(false);
  //   } else if (event.key === 'Escape') {
  //     setOpen(false);
  //   }
  // }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ color: 'black' }}
      >
        {active}
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
                  // onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    sx={{ color: active === 'English' ? 'black' : 'rgba(0, 0, 0, 0.3)' }}
                    onClick={(event) => handleChange(event, 'English')}
                  >
                    English
                  </MenuItem>
                  <MenuItem
                    sx={{ color: active === '中文' ? 'black' : 'rgba(0, 0, 0, 0.3)' }}
                    onClick={(event) => handleChange(event, '中文')}
                  >
                    中文
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
