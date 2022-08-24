import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../../../components/CustomTypos';
import { ConfirmButton } from '../../../components/CustomButtons';
import { ContainerBox } from '../../../components/CustomContainer';
import { useUserContext } from '../../../contexts/UserContext';
import CustomTextField from '../../../components/CustomTextField';
import { getTime } from '../../../service/common';
import {
  checkHiveNodeStatus,
  createHiveNode,
  getHiveNodeInfo,
  getHiveNodesList,
  getIPFromDomain,
  getLocationFromIP
} from '../../../service/fetch';

export default function CreateNode() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState(false);
  const [onProgress, setOnProgress] = useState(false);

  const handleCreateNode = async () => {
    setOnProgress(true);
    if (ownerDid && url) {
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
      // get ip and location
      const hostName = url.includes('https://')
        ? url.replace('https://', '')
        : url.replace('http://', '');
      const ipAddress = await getIPFromDomain(hostName);
      const location = await getLocationFromIP(ipAddress, 'json');
      const curTime = getTime(new Date().getTime());
      // form a new node info
      const newNode = {
        name: nodeName,
        created: `${curTime.date} ${curTime.time}`,
        ip: ipAddress,
        owner_did: ownerDid,
        area: `${location.country} ${location.region} ${location.city}`,
        email,
        url,
        remark: description
      };

      // check accessible and ownership
      const nodeServiceDid = nodeInfo.getServiceDid();
      const nodeOwnerDid = nodeInfo.getOwnerDid();
      const nodeOwnershipPresentation = nodeInfo.getOwnershipPresentation();
      const vcs = nodeOwnershipPresentation.getCredentials();
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
      const result = await createHiveNode(newNode);
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
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Create Node</PageTitleTypo>
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
            placeholder="URL (e.g.  https://example.com)"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={urlErr}
            errorText="Url can not be empty"
            changeHandler={(value) => {
              setUrl(value);
              setUrlErr(false);
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
          <ConfirmButton disabled={onProgress} onClick={handleCreateNode}>
            Confirm
          </ConfirmButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
