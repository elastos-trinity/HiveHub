import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PageTitleTypo } from '../style';

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  textAlign: 'center',
  borderRadius: '20px',
  width: '100%',
  padding: '20px 50px 20px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '30px 70px'
  }
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: '200px',
  backgroundColor: '#FF931E',
  color: 'white',
  fontWeight: 600,
  lineHeight: '12px',
  fontSize: '10px',
  height: '30px',
  padding: '9px 38px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '24px',
    fontSize: '20px',
    height: '60px',
    padding: '17px 68px'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.7)'
  }
}));

export default function CreateNode() {
  const navigate = useNavigate();

  const handleCreateNode = () => {
    navigate('/dashboard/nodes');
  };

  return (
    <>
      <PageTitleTypo mt={{ xs: 6.25, md: 3.15 }}>Create Node</PageTitleTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 3.75, md: 5 }}>
          <CustomTextField placeholder="Owner DID" variant="standard" />
          <CustomTextField placeholder="Node Name" variant="standard" />
          <CustomTextField placeholder="Email" variant="standard" />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={{ xs: 5, md: 12.5 }}
          >
            <CustomTextField placeholder="Country" variant="standard" />
            <CustomTextField placeholder="Province" variant="standard" />
            <CustomTextField placeholder="District" variant="standard" />
          </Stack>
          <CustomTextField placeholder="URL" variant="standard" />
          <CustomTextField placeholder="Description" variant="standard" />
        </Stack>
        <Stack direction="row" mt={{ xs: 10, md: 17.5 }} spacing={{ xs: 2.5, md: 5 }}>
          <CustomButton
            sx={{
              background: '#B3B3B3',
              '&:hover': {
                backgroundColor: 'rgba(179, 179, 179, 0.7)'
              }
            }}
            onClick={() => navigate('/dashboard/nodes')}
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleCreateNode}>Confirm</CustomButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
