import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { ConfirmButton } from '../../../components/Custom/CustomButtons';
import { ContainerBox } from '../../../components/Custom/CustomContainer';
import CustomTextField from '../../../components/Custom/CustomTextField';
import { useUserContext } from '../../../contexts/UserContext';
import { checkHiveNodeStatus, getHiveNodeInfo } from '../../../service/fetch';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

export default function CreateNode() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { addHiveNode, getHiveNodesList } = useHiveHubContracts();
  const { user } = useUserContext();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState(false);
  const [onProgress, setOnProgress] = useState(false);

  const handleCreateNode = async () => {
    setOnProgress(true);
    if (ownerDid && url) {
      if (!user.didDoc || !Object.keys(user.didDoc).length) {
        enqueueSnackbar('Your DID is not published to the side chain, Please publish your DID.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      // check url format
      if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        enqueueSnackbar('Invalid url format', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }
      // check duplicacy
      const registeredNodes = await getHiveNodesList(undefined, undefined, false, false, false);
      const duplicatedNodes = [];
      await Promise.all(
        registeredNodes.map((item) => {
          const node = { ...item };
          if (node.url === url) duplicatedNodes.push(node.url);
          return node;
        })
      );
      if (duplicatedNodes.length > 0) {
        enqueueSnackbar('Already registered node', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }
      // get node info
      const nodeInfo = await getHiveNodeInfo(user.did, url);
      if (!nodeInfo) {
        enqueueSnackbar('Invalid node url', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }
      const nodeName = nodeInfo.getName();
      const email = nodeInfo.getEmail();
      const description = nodeInfo.getDescription();
      if (!nodeName || !email || !description) {
        enqueueSnackbar("Hive node's information is insufficient.", {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }

      // check accessible and ownership
      const nodeServiceDid = nodeInfo.getServiceDid();
      const nodeOwnerDid = nodeInfo.getOwnerDid();
      const nodeOwnershipPresentation = nodeInfo.getOwnershipPresentation();
      const vcs = nodeOwnershipPresentation.getCredentials();
      const signature = vcs[0].getProof().getSignature();
      const credentialIssuer = `did:elastos:${vcs[0].getIssuer().getMethodSpecificId()}`;
      const holderDid = nodeOwnershipPresentation.getHolder().getMethodSpecificId();
      const presentationHolder = `did:elastos:${holderDid}`;
      if (
        !(
          ownerDid === user.did &&
          nodeOwnerDid === user.did &&
          nodeServiceDid === presentationHolder &&
          user.did === credentialIssuer
        )
      ) {
        enqueueSnackbar('Invalid owner', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }
      // check node status
      const status = await checkHiveNodeStatus(url);
      if (!status) {
        enqueueSnackbar('Hive Node is not accessible.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setOnProgress(false);
        return;
      }

      // form a new node info
      const newNode = {
        name: nodeName,
        ownerDid,
        description,
        avatar: user.avatar,
        banner: '', // TODO: update it
        email,
        endpoint: url,
        signature,
        createdAt: new Date().getTime()
      };

      const result = await addHiveNode(newNode);
      if (result) {
        enqueueSnackbar('Create Hive Node success.', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        navigate('/dashboard/nodes');
      } else {
        enqueueSnackbar('Create Hive Node failed.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      }
      setOnProgress(false);
    } else {
      setOwnerDidErr(!ownerDid);
      setUrlErr(!url);
      setOnProgress(false);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>Create and deploy a Hive node</HeaderTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 0, md: 1 }}>
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
            placeholder="Address (e.g. https://example.com)"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={urlErr}
            errorText="Address can not be empty"
            changeHandler={(value) => {
              setUrl(value);
              setUrlErr(false);
            }}
          />
        </Stack>
        <Stack
          direction="row"
          mt={{ xs: 6, md: 7.5 }}
          mb={{ xs: 0, md: 1 }}
          spacing={{ xs: 1.5, md: 3 }}
        >
          <ConfirmButton
            onClick={() => navigate('/dashboard/node')}
            sx={{
              color: '#FF931E',
              background: 'transparent',
              border: { xs: '1px solid #FF931E', md: '2px solid #FF931E' }
            }}
          >
            Back
          </ConfirmButton>
          <ConfirmButton disabled={onProgress} onClick={handleCreateNode}>
            Deploy node
          </ConfirmButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
