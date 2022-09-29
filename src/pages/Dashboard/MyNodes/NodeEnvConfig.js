import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line camelcase
import { binary_to_base58 } from 'base58-js';
import { PageTitleTypo } from '../../../components/CustomTypos';
import { ConfirmButton } from '../../../components/CustomButtons';
import { ContainerBox } from '../../../components/CustomContainer';
import { useUserContext } from '../../../contexts/UserContext';
import CustomTextField from '../../../components/CustomTextField';
import { createHiveNodeEnvConfig, getHiveNodeInfo } from '../../../service/fetch';

export default function NodeEnvConfig() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [servicePK, setServicePK] = useState('');
  const [servicePKErr, setServicePKErr] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNameErr, setNodeNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeDescriptionErr, setNodeDescriptionErr] = useState(false);

  const handleSaveEnvConfig = async () => {
    if (ownerDid && servicePK && password && nodeName && email && nodeDescription) {
      let nodeCredential = '';
      try {
        const nodeInfo = await getHiveNodeInfo(ownerDid, undefined);
        const nodeOwnershipPresentation = nodeInfo.getOwnershipPresentation();
        const vcs = nodeOwnershipPresentation.getCredentials();
        if (vcs && vcs.length) nodeCredential = binary_to_base58(vcs[0].toString());
      } catch (err) {
        console.error(err);
      }
      try {
        createHiveNodeEnvConfig(
          servicePK,
          passphrase,
          password,
          nodeName,
          email,
          nodeDescription,
          nodeCredential
        );
        enqueueSnackbar('Create Hive Node ENV success.', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        navigate('/dashboard/nodes');
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Creating Hive Node ENV failed.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      }
    } else {
      setOwnerDidErr(!ownerDid);
      setServicePKErr(!servicePK);
      setPasswordErr(!password);
      setNodeNameErr(!nodeName);
      setEmailErr(!email);
      setNodeDescriptionErr(!nodeDescription);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Env Configuration</PageTitleTypo>
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
            placeholder="Passphrase"
            variant="standard"
            inputValue={passphrase}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={false}
            errorText="Passphrase can not be empty"
            changeHandler={(value) => setPassphrase(value)}
          />
          <CustomTextField
            placeholder="Password"
            variant="standard"
            inputValue={password}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={passwordErr}
            errorText="Password can not be empty"
            changeHandler={(value) => {
              setPassword(value);
              setPasswordErr(false);
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
        <Stack direction="row" mt={{ xs: 8, md: 10 }} spacing={{ xs: 2.5, md: 5 }}>
          <ConfirmButton
            sx={{
              background: '#B3B3B3',
              '&:hover': {
                backgroundColor: 'rgba(179, 179, 179, 0.7)'
              }
            }}
            onClick={() => navigate('/dashboard/nodes')}
          >
            Cancel
          </ConfirmButton>
          <ConfirmButton onClick={handleSaveEnvConfig}>Confirm</ConfirmButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
