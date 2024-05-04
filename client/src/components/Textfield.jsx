import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Textfield({ id, label, variant, value, onChange }) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '50ch' }, // Adjust width as needed
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id={id}
        label={label}
        variant={variant}
        value={value}
        onChange={onChange}
        multiline
        minRows={15} 
        maxRows={22} 
      />
    </Box>
  );
}
