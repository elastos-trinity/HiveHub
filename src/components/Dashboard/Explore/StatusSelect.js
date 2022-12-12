import React from 'react';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { LabelTypo } from '../../Custom/CustomTypos';

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  variant: 'menu'
};

const menuItems = [
  { name: 'All', status: undefined },
  { name: 'Online', status: true },
  { name: 'Offline', status: false }
];

StatusSelect.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func,
  sx: PropTypes.object
};

export default function StatusSelect({ selected, onChange, sx = {} }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      value={selected}
      onChange={handleChange}
      size="small"
      inputProps={{
        'aria-label': 'Without label'
      }}
      sx={{
        background: '#1D1F21',
        border: '1px solid #FF931E',
        borderRadius: '20px',
        width: { xs: '100%', md: '90px' },
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: '0 !important'
        },
        ...sx
      }}
      MenuProps={{
        ...MenuProps,
        sx: {
          '& .MuiMenu-list': {
            background: '#131317',
            '& li': {
              justifyContent: 'left'
            }
          }
        }
      }}
    >
      {menuItems.map((item, i) => (
        <MenuItem key={i} value={i} autoFocus={selected === i}>
          <LabelTypo sx={{ fontFamily: 'sans-serif', color: '#FFF' }}>{item.name}</LabelTypo>
        </MenuItem>
      ))}
    </Select>
  );
}
