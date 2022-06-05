import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const ContainerBox = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  textAlign: 'center',
  borderRadius: '18px',
  height: '760px',
  width: '100%',
  marginBottom: '20px',
  padding: '30px 80px'
});

const CustomButton = styled(Button)({
  width: '150px',
  borderRadius: '18px',
  fontWeight: 'normal',
  color: 'white',
  backgroundColor: 'rgba(255, 147, 30, 1)',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.7)',
    boxShadow: 'none'
  }
});

const CustomTextField = styled(TextField)({
  width: '100%',
  marginTop: '20px',
  marginBottom: '40px',
  '#standard-basic': {
    padding: '5px 20px'
  }
});

export default function HiveNodeAdd() {
  return (
    <>
      <Box sx={{ my: 8 }}>
        <Typography variant="h3">Create Node</Typography>
      </Box>

      <ContainerBox>
        <Box>
          <CustomTextField id="standard-basic" placeholder="Owner DID" variant="standard" error />
        </Box>

        <Box>
          <CustomTextField id="standard-basic" placeholder="Node Name" variant="standard" />
        </Box>

        <Box>
          <CustomTextField id="standard-basic" placeholder="Email" variant="standard" />
        </Box>

        <Stack direction="row" alignItems="center">
          <Box sx={{ width: '150px', marginRight: '100px' }}>
            <CustomTextField id="standard-basic" placeholder="Country" variant="standard" />
          </Box>
          <Box sx={{ width: '150px', marginRight: '100px' }}>
            <CustomTextField id="standard-basic" placeholder="Province" variant="standard" />
          </Box>
          <Box sx={{ width: '150px', marginRight: '100px' }}>
            <CustomTextField id="standard-basic" placeholder="District" variant="standard" />
          </Box>
        </Stack>

        <Box>
          <CustomTextField id="standard-basic" placeholder="URL" variant="standard" />
        </Box>

        <Box>
          <CustomTextField id="standard-basic" placeholder="Description" variant="standard" />
        </Box>

        <CustomButton variant="contained" sx={{ marginTop: '80px' }}>
          Confirm
        </CustomButton>
      </ContainerBox>
    </>
  );
}
