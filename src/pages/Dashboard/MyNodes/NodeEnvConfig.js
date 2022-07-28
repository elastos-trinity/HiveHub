import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PageTitleTypo } from '../style';
import useUser from '../../../hooks/useUser';
import CustomTextField from '../../../components/CustomTextField';

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
  const { user } = useUser();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [servicePK, setServicePK] = useState('');
  const [servicePKErr, setServicePKErr] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNameErr, setNodeNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeDescriptionErr, setNodeDescriptionErr] = useState(false);

  const handleSaveEnvConfig = () => {
    if (ownerDid && servicePK && nodeName && email && nodeDescription) {
      navigate('/dashboard/nodes');
    } else {
      setOwnerDidErr(!ownerDid);
      setServicePKErr(!servicePK);
      setNodeNameErr(!nodeName);
      setEmailErr(!email);
      setNodeDescriptionErr(!nodeDescription);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <PageTitleTypo mt={{ xs: 6.25, md: 3.15 }}>Env Configuration</PageTitleTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 3.75, md: 5 }}>
          <CustomTextField
            placeholder="Owner DID"
            variant="standard"
            inputValue={ownerDid}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={ownerDidErr}
            errorText="Owner DID can not be empty"
            disabled
          />
          <CustomTextField
            placeholder="Service private Key"
            variant="standard"
            inputValue={servicePK}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={servicePKErr}
            errorText="Service private key can not be empty"
            changeHandler={(value) => {
              setServicePK(value);
              setServicePKErr(false);
            }}
          />
          <CustomTextField
            placeholder="Node name"
            variant="standard"
            inputValue={nodeName}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={nodeNameErr}
            errorText="Node name can not be empty"
            changeHandler={(value) => {
              setNodeName(value);
              setNodeNameErr(false);
            }}
          />
          <CustomTextField
            placeholder="Email"
            variant="standard"
            inputValue={email}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={emailErr}
            errorText="Email can not be empty"
            changeHandler={(value) => {
              setEmail(value);
              setEmailErr(false);
            }}
          />
          <CustomTextField
            placeholder="Node description"
            variant="standard"
            inputValue={nodeDescription}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={nodeDescriptionErr}
            errorText="Node description can not be empty"
            changeHandler={(value) => {
              setNodeDescription(value);
              setNodeDescriptionErr(false);
            }}
          />
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
