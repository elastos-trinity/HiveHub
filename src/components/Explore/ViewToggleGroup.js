import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import TableRowsIcon from '@mui/icons-material/TableRows';

ViewToggleGroup.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func,
  sx: PropTypes.object
};

export default function ViewToggleGroup({ selected, onChange, sx = {} }) {
  return (
    <ToggleButtonGroup
      value={selected}
      onChange={(_, value) => onChange(value)}
      size="small"
      color="warning"
      exclusive
      sx={{
        '& .MuiToggleButton-root': {
          borderColor: '#FF931E'
        },
        ...sx
      }}
    >
      <ToggleButton value={0} sx={{ pl: 2, pr: 1, borderRadius: '20px' }}>
        <LanguageIcon />
      </ToggleButton>
      <ToggleButton value={1} sx={{ pl: 1, pr: 2, borderRadius: '20px' }}>
        <TableRowsIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
