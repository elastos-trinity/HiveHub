import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, TextField } from '@mui/material';

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
    setInvalid(number ? text === '' || Number.isNaN(Number(text)) : !text);
  }, [text]);

  useEffect(() => {
    setText(inputValue === undefined || (number && inputValue === 'NaN') ? '' : inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (error) setInvalid(true);
  }, [error]);

  console.log(fontSize);
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
        onChange={handleInputChange}
        sx={{ fontSize, fontWeight, height }}
      />
      {error && invalid && (
        <Typography fontSize={12} fontWeight={500} color="#EB5757">
          {errorText}
        </Typography>
      )}
    </Stack>
  );
}
