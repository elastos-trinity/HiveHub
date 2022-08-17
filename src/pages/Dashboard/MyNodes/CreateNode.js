import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
// import dns from 'dns';
import { PageTitleTypo } from '../../../components/CustomTypos';
import { ConfirmButton } from '../../../components/CustomButtons';
import { ContainerBox } from '../../../components/CustomContainer';
import useConnectEE from '../../../hooks/useConnectEE';
import CustomTextField from '../../../components/CustomTextField';
import { getTime } from '../../../service/common';
import HiveHubServer from '../../../service/HiveHubServer';
import { getHiveNodesList, getRestService } from '../../../service/fetch';

export default function CreateNode() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useConnectEE();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState(false);

  const handleCreateNode = async () => {
    if (ownerDid && url) {
      const country = 'China';
      const province = 'Shanghai';
      const district = 'Putuo';
      const registeredNodes = await getHiveNodesList(undefined, undefined, false, false);
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
        return;
      }
      // dns.lookup(url, (err, address, familly) => {
      //   console.log(address);
      //   console.log(familly)
      //   console.log(err)
      // });
      const restService = await getRestService(user.did);
      const nodeInfo = await restService.serviceEndpoint.getNodeInfo();
      if (!nodeInfo) {
        enqueueSnackbar('Invalid node url', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
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
        return;
      }
      const curTime = getTime(new Date().getTime());
      const newNode = {
        name: nodeName,
        created: `${curTime.date} ${curTime.time}`,
        ip: '192.115.24.2', // TODO:
        owner_did: ownerDid,
        area: `${country} ${province} ${district}`,
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
        return;
      }
      const status = await HiveHubServer.isOnline(url);
      if (!status) {
        enqueueSnackbar('Hive Node is not accessible.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      try {
        await HiveHubServer.addHiveNode(newNode);
        enqueueSnackbar('Create Hive Node success.', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      } catch (err) {
        console.error(err);
      }
      // const json = await HiveHubServer.addHiveNode(newNode);
      // acknowledged: true
      // inserted_id: "62c2e6560d6930f229239199"
      navigate('/dashboard/nodes');
    } else {
      setOwnerDidErr(!ownerDid);
      setUrlErr(!url);
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
            placeholder="URL"
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
          <ConfirmButton onClick={handleCreateNode}>Confirm</ConfirmButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
