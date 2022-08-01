import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { useLanguageContext } from '../contexts/LanguageContext';

LanguageBar.propTypes = {
  sx: PropTypes.object
};

export default function LanguageBar({ sx }) {
  const { language, setLanguage, changeLanguage } = useLanguageContext();
  const [active, setActive] = useState(language === 'en' ? 'English' : '中文');
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    changeLanguage();
    setLanguage((prevState) => (prevState === 'en' ? 'zh' : 'en'));
    setActive((prevState) => (prevState === 'English' ? '中文' : 'English'));
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
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box sx={{ textAlign: 'center', ...sx }}>
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
                    sx={{ color: 'rgba(0, 0, 0, 0.3)' }}
                    onClick={(event) => handleChange(event)}
                  >
                    {active === 'English' ? '中文' : 'English'}
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
