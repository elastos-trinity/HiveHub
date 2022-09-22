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

const languageTypes = [
  { value: 'en', name: 'English' },
  { value: 'zh', name: '中文' }
];

export default function LanguageBar({ sx }) {
  const { language, setLanguage, changeLanguage } = useLanguageContext();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    changeLanguage(language === 'en' ? 'zh' : 'en');
    setLanguage((prevState) => (prevState === 'en' ? 'zh' : 'en'));
    setOpen(false);
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
        {languageTypes.find((item) => item.value === language).name}
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
                    sx={{ color: 'rgba(0, 0, 0, 0.3)' }}
                    onClick={(event) => handleChange(event)}
                  >
                    {languageTypes.find((item) => item.value === language).name === 'English'
                      ? '中文'
                      : 'English'}
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
