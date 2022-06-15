import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField } from '@mui/material';
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

export default function NodeEnvConfig() {
  const navigate = useNavigate();

  const handleSaveEnvConfig = () => {
    navigate('/dashboard/nodes');
  };

  return (
    <>
      <PageTitleTypo mt={{ xs: 6.25, md: 3.15 }}>Env Configuration</PageTitleTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 3.75, md: 5 }}>
          <CustomTextField placeholder="Owner DID" variant="standard" />
          <CustomTextField placeholder="Service private Key" variant="standard" />
          <CustomTextField placeholder="Node name" variant="standard" />
          <CustomTextField placeholder="Email" variant="standard" />
          <CustomTextField placeholder="Node description" variant="standard" />
        </Stack>
        <Stack direction="row" mt={{ xs: 14.5, md: 31.25 }} spacing={{ xs: 2.5, md: 5 }}>
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
          <CustomButton onClick={handleSaveEnvConfig}>Confirm</CustomButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
