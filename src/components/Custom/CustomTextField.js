import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, TextField, Box } from '@mui/material';

CustomTextField.propTypes = {
  variant: PropTypes.any,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  inputValue: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.number,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
  number: PropTypes.number,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  limit: PropTypes.number,
  sx: PropTypes.any,
  changeHandler: PropTypes.func
};

export default function CustomTextField({
  variant,
  disabled,
  inputValue,
  title,
  placeholder,
  height,
  multiline,
  rows,
  fontSize,
  fontWeight,
  number = false,
  error = false,
  errorText = '',
  limit,
  sx,
  changeHandler
}) {
  const [text, setText] = useState('');
  const [invalid, setInvalid] = useState(true);

  const handleInputChange = (event) => {
    const value = limit ? event.target.value.slice(0, limit) : event.target.value;
    let valid = false;
    if (number) {
      valid = !Number.isNaN(Number(value));
    } else {
      valid = true;
    }

    if (valid) {
      setText(value);
      changeHandler(value);
    }
  };

  useEffect(() => {
    setText(inputValue === undefined || (number && inputValue === 'NaN') ? '' : inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    setInvalid((number ? text === '' || Number.isNaN(Number(text)) : !text) || error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, error]);

  return (
    <Stack spacing={0.5} sx={{ ...sx }}>
      {title && (
        <Typography fontSize={12} fontWeight={700}>
          {title}
        </Typography>
      )}
      <TextField
        variant={variant}
        disabled={disabled}
        placeholder={placeholder}
        value={text}
        multiline={multiline}
        rows={rows}
        error={error}
        color="warning"
        onChange={handleInputChange}
        InputProps={{
          style: { color: '#FF931E', borderBottom: '1px solid #FF931E' }
        }}
        sx={{ fontSize, fontWeight, height }}
      />
      {error && invalid && (
        <Box sx={{ position: 'relative' }}>
          <Typography
            fontSize={12}
            fontWeight={500}
            color="#EB5757"
            sx={{ position: 'absolute', mt: '10px !important', mx: 'auto', width: '100%' }}
          >
            {errorText}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
