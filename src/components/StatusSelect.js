import React from 'react';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { LabelTypo } from './Custom/CustomTypos';

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
        textAlign: 'center'
      }}
      MenuProps={{
        ...MenuProps,
        sx: {
          '& .MuiMenu-list': {
            background: 'gray'
          },
          '& .Mui-selected': {
            background: 'red'
          },
          '& .Mui-selected:hover': {
            background: 'red'
          }
        }
      }}
    >
      {menuItems.map((item, i) => (
        <MenuItem
          key={i}
          value={i}
          autoFocus={selected === i}
          //   sx={{ color: selected === i ? '#FF931E' : '#FFF', background: '#131317' }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <LabelTypo sx={{ fontFamily: 'Roboto', color: '#FFF' }}>{item.name}</LabelTypo>
        </MenuItem>
      ))}
    </Select>
  );
}
